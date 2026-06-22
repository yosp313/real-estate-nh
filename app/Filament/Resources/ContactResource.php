<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactResource\Pages;
use App\Models\Contact;
use App\Filament\Resources\BaseResource;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;
use UnitEnum;

class ContactResource extends BaseResource
{
    protected static ?string $model = Contact::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-envelope';

    protected static string|UnitEnum|null $navigationGroup = 'Communications';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'name';

    public static function getNavigationLabel(): string
    {
        return __('messages.contacts');
    }

    public static function getModelLabel(): string
    {
        return __('messages.contact_record');
    }

    public static function getPluralModelLabel(): string
    {
        return __('messages.contacts');
    }

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::where('is_read', false)->count();

        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'danger';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make(__('Contact Information'))->schema([
                TextInput::make('name')->label(__('Name'))->disabled(),
                TextInput::make('email')->label(__('Email'))->disabled(),
                TextInput::make('phone')->label(__('Phone'))->disabled(),
                Toggle::make('is_read')->label(__('Read')),
            ])->columns(2),
            Section::make(__('Message'))->schema([
                Textarea::make('message')->label(__('Message'))->disabled()->rows(6)->columnSpanFull(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return static::getDefaultTable($table)
            ->columns([
                IconColumn::make('is_read')->label('')->boolean()
                    ->trueIcon('heroicon-o-envelope-open')->falseIcon('heroicon-o-envelope')
                    ->trueColor('gray')->falseColor('danger'),
                TextColumn::make('name')->label(__('Name'))->searchable()->sortable(),
                TextColumn::make('email')->label(__('Email'))->searchable()->copyable(),
                TextColumn::make('phone')->label(__('Phone'))->searchable()->copyable()->toggleable(),
                TextColumn::make('message')->label(__('Message'))->limit(50)->toggleable(),
                TextColumn::make('created_at')->label(__('Date'))->dateTime('M j, Y H:i')->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_read')->label(__('Read Status'))
                    ->trueLabel(__('Read'))->falseLabel(__('Unread')),
            ])
            ->recordActions([
                ViewAction::make()->after(fn ($record) => $record->update(['is_read' => true])),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('markAsRead')->label(__('Mark as Read'))->icon('heroicon-o-envelope-open')
                        ->action(fn (Collection $records) => $records->each->update(['is_read' => true])),
                    BulkAction::make('markAsUnread')->label(__('Mark as Unread'))->icon('heroicon-o-envelope')
                        ->action(fn (Collection $records) => $records->each->update(['is_read' => false])),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    protected static function getListPage(): string
    {
        return Pages\ListContacts::class;
    }

    protected static function getCreatePage(): string
    {
        return '';
    }

    protected static function getViewPage(): string
    {
        return Pages\ViewContact::class;
    }

    protected static function getEditPage(): string
    {
        return '';
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContacts::route('/'),
            'view' => Pages\ViewContact::route('/{record}'),
        ];
    }
}