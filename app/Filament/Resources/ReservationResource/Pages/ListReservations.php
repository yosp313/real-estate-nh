<?php

namespace App\Filament\Resources\ReservationResource\Pages;

use App\Filament\Resources\ReservationResource;
use App\Services\AdminCsvService;
use Filament\Actions;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Storage;

class ListReservations extends ListRecords
{
    protected static string $resource = ReservationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\Action::make('exportCsv')
                ->label(__('Export CSV'))
                ->icon('heroicon-o-arrow-down-tray')
                ->action(function (AdminCsvService $csvService) {
                    $csv = $csvService->exportReservations();

                    return response()->streamDownload(function () use ($csv): void {
                        echo $csv;
                    }, 'reservations.csv', ['Content-Type' => 'text/csv']);
                }),
            Actions\Action::make('importCsv')
                ->label(__('Import CSV'))
                ->icon('heroicon-o-arrow-up-tray')
                ->form([
                    FileUpload::make('file')
                        ->label(__('CSV File'))
                        ->required()
                        ->disk('local')
                        ->directory('imports')
                        ->acceptedFileTypes(['text/csv', 'text/plain'])
                        ->maxSize(10240),
                ])
                ->action(function (array $data, AdminCsvService $csvService): void {
                    $count = $csvService->importReservations(Storage::disk('local')->path($data['file']));

                    Notification::make()
                        ->title(__('Import completed'))
                        ->body(__('Imported :count rows.', ['count' => $count]))
                        ->success()
                        ->send();
                }),
        ];
    }
}
