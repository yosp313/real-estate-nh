<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\Project;
use App\Models\Reservation;
use Carbon\CarbonInterface;

class AdminCsvService
{
    public function exportProjects(): string
    {
        $header = ['slug', 'name', 'description', 'type', 'area_sqm', 'location', 'bedrooms', 'bathrooms', 'is_featured', 'price_starts_at', 'image_url', 'status'];
        $rows = Project::query()
            ->orderBy('id')
            ->get($header)
            ->map(fn (Project $project) => [
                $project->slug,
                $project->name,
                $project->description,
                $project->type,
                $project->area_sqm,
                $project->location,
                $project->bedrooms,
                $project->bathrooms,
                $project->is_featured ? 1 : 0,
                $project->price_starts_at,
                $project->image_url,
                $project->status,
            ])
            ->all();

        return $this->toCsv($header, $rows);
    }

    public function exportReservations(): string
    {
        $header = ['project_slug', 'customer_name', 'customer_email', 'customer_phone', 'created_at'];
        $rows = Reservation::query()
            ->with('project:id,slug')
            ->orderBy('id')
            ->get(['project_id', 'customer_name', 'customer_email', 'customer_phone', 'created_at'])
            ->map(fn (Reservation $reservation) => [
                $reservation->project?->slug,
                $reservation->customer_name,
                $reservation->customer_email,
                $reservation->customer_phone,
                optional($reservation->created_at)->toDateTimeString(),
            ])
            ->all();

        return $this->toCsv($header, $rows);
    }

    public function exportReservationsForDate(CarbonInterface $date): string
    {
        $header = ['project_slug', 'customer_name', 'customer_email', 'customer_phone', 'created_at'];
        $rows = Reservation::query()
            ->with('project:id,slug')
            ->whereDate('created_at', $date->toDateString())
            ->orderBy('id')
            ->get(['project_id', 'customer_name', 'customer_email', 'customer_phone', 'created_at'])
            ->map(fn (Reservation $reservation) => [
                $reservation->project?->slug,
                $reservation->customer_name,
                $reservation->customer_email,
                $reservation->customer_phone,
                optional($reservation->created_at)->toDateTimeString(),
            ])
            ->all();

        return $this->toCsv($header, $rows);
    }

    public function exportContacts(): string
    {
        $header = ['name', 'email', 'phone', 'message', 'is_read', 'created_at'];
        $rows = Contact::query()
            ->orderBy('id')
            ->get(['name', 'email', 'phone', 'message', 'is_read', 'created_at'])
            ->map(fn (Contact $contact) => [
                $contact->name,
                $contact->email,
                $contact->phone,
                $contact->message,
                $contact->is_read ? 1 : 0,
                optional($contact->created_at)->toDateTimeString(),
            ])
            ->all();

        return $this->toCsv($header, $rows);
    }

    public function importProjects(string $path): int
    {
        $rows = $this->fromCsv($path);
        $count = 0;

        foreach ($rows as $row) {
            if (empty($row['slug']) || empty($row['name'])) {
                continue;
            }

            Project::updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'name' => $row['name'],
                    'description' => $row['description'] ?? '',
                    'type' => $row['type'] ?? 'apartment',
                    'area_sqm' => $this->nullableInt($row['area_sqm'] ?? null),
                    'location' => $row['location'] ?? null,
                    'bedrooms' => $this->nullableInt($row['bedrooms'] ?? null),
                    'bathrooms' => $this->nullableInt($row['bathrooms'] ?? null),
                    'is_featured' => $this->toBool($row['is_featured'] ?? null),
                    'price_starts_at' => $row['price_starts_at'] ?? '',
                    'image_url' => $row['image_url'] ?? '',
                    'status' => $this->normalizeStatus($row['status'] ?? 'available'),
                ]
            );

            $count++;
        }

        return $count;
    }

    public function importReservations(string $path): int
    {
        $rows = $this->fromCsv($path);
        $count = 0;

        foreach ($rows as $row) {
            if (empty($row['project_slug']) || empty($row['customer_email'])) {
                continue;
            }

            $project = Project::query()->where('slug', $row['project_slug'])->first();

            if ($project === null) {
                continue;
            }

            Reservation::updateOrCreate(
                [
                    'project_id' => $project->id,
                    'customer_email' => $row['customer_email'],
                ],
                [
                    'customer_name' => $row['customer_name'] ?? '',
                    'customer_phone' => $row['customer_phone'] ?? '',
                ]
            );

            $count++;
        }

        return $count;
    }

    public function importContacts(string $path): int
    {
        $rows = $this->fromCsv($path);
        $count = 0;

        foreach ($rows as $row) {
            if (empty($row['name']) || empty($row['email']) || empty($row['message'])) {
                continue;
            }

            Contact::create([
                'name' => $row['name'],
                'email' => $row['email'],
                'phone' => $row['phone'] ?? null,
                'message' => $row['message'],
                'is_read' => $this->toBool($row['is_read'] ?? null),
            ]);

            $count++;
        }

        return $count;
    }

    /**
     * @param  array<int, string>  $header
     * @param  array<int, array<int, mixed>>  $rows
     */
    private function toCsv(array $header, array $rows): string
    {
        $stream = fopen('php://temp', 'rb+');
        fputcsv($stream, $header);

        foreach ($rows as $row) {
            fputcsv($stream, $row);
        }

        rewind($stream);
        $contents = stream_get_contents($stream) ?: '';
        fclose($stream);

        return $contents;
    }

    /**
     * @return array<int, array<string, string|null>>
     */
    private function fromCsv(string $path): array
    {
        $stream = fopen($path, 'rb');

        if ($stream === false) {
            return [];
        }

        $header = fgetcsv($stream);

        if (! is_array($header)) {
            fclose($stream);

            return [];
        }

        $rows = [];

        while (($record = fgetcsv($stream)) !== false) {
            if ($record === [null] || $record === []) {
                continue;
            }

            $rows[] = array_combine($header, $record) ?: [];
        }

        fclose($stream);

        return $rows;
    }

    private function toBool(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        return in_array((string) $value, ['1', 'true', 'yes'], true);
    }

    private function nullableInt(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) $value;
    }

    private function normalizeStatus(mixed $value): string
    {
        return (string) $value === 'sold' ? 'sold' : 'available';
    }
}
