<?php

namespace App\Filament\Resources\ContactResource\Pages;

use App\Filament\Resources\ContactResource;
use App\Services\AdminCsvService;
use Filament\Actions;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Storage;

class ListContacts extends ListRecords
{
    protected static string $resource = ContactResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('exportCsv')
                ->label(__('Export CSV'))
                ->icon('heroicon-o-arrow-down-tray')
                ->action(function (AdminCsvService $csvService) {
                    $csv = $csvService->exportContacts();

                    return response()->streamDownload(function () use ($csv): void {
                        echo $csv;
                    }, 'contacts.csv', ['Content-Type' => 'text/csv']);
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
                    $count = $csvService->importContacts(Storage::disk('local')->path($data['file']));

                    Notification::make()
                        ->title(__('Import completed'))
                        ->body(__('Imported :count rows.', ['count' => $count]))
                        ->success()
                        ->send();
                }),
        ];
    }
}
