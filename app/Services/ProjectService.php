<?php

namespace App\Services;

use App\Models\Project;

class ProjectService
{
    /**
     * @var array<int, string>
     */
    private array $propertyTypes = [
        'apartment',
        'villa',
        'townhouse',
        'duplex',
        'penthouse',
        'studio',
        'commercial',
    ];

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getIndexData(array $filters): array
    {
        $type = $this->normalizeType($filters['type'] ?? null);
        $minArea = $this->normalizeMinArea($filters['min_area'] ?? null);
        $projectSlug = $this->normalizeProjectSlug($filters['project'] ?? null);

        $query = Project::query();

        if ($type !== null) {
            $query->where('type', $type);
        }

        if ($minArea !== null) {
            $query->where('area_sqm', '>=', $minArea);
        }

        if ($projectSlug !== null) {
            $query->where('slug', $projectSlug);
        }

        return [
            'projects' => $query->get([
                'id',
                'slug',
                'name',
                'type',
                'area_sqm',
                'location',
                'bedrooms',
                'bathrooms',
                'is_featured',
                'price_starts_at',
                'image_url',
            ])->toArray(),
            'allProjects' => Project::all(['id', 'slug', 'name'])->toArray(),
            'propertyTypes' => $this->propertyTypes,
            'existingTypes' => Project::distinct()->pluck('type')->filter()->values()->all(),
            'filters' => [
                'type' => $type,
                'min_area' => $minArea !== null ? (string) $minArea : null,
                'project' => $projectSlug,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function getShowData(Project $project): array
    {
        return [
            'project' => $project,
            'relatedProjects' => Project::where('type', $project->type)
                ->where('id', '!=', $project->id)
                ->limit(3)
                ->get(['id', 'slug', 'name', 'price_starts_at', 'image_url']),
        ];
    }

    private function normalizeType(mixed $type): ?string
    {
        if (! is_string($type)) {
            return null;
        }

        return in_array($type, $this->propertyTypes, true) ? $type : null;
    }

    private function normalizeMinArea(mixed $minArea): ?int
    {
        if (! is_numeric($minArea)) {
            return null;
        }

        $normalized = (int) $minArea;

        return $normalized >= 0 && $normalized <= 100000 ? $normalized : null;
    }

    private function normalizeProjectSlug(mixed $projectSlug): ?string
    {
        if (! is_string($projectSlug) || $projectSlug === '') {
            return null;
        }

        return Project::where('slug', $projectSlug)->exists() ? $projectSlug : null;
    }
}
