<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReservationResource\Pages;
use App\Models\Reservation;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

class ReservationResource extends BaseResource
{
    protected static ?string $model = Reservation::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static string|UnitEnum|null $navigationGroup = 'Real Estate';

    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'customer_name';

    public static function getNavigationLabel(): string
    {
        return __('messages.reservations');
    }

    public static function getModelLabel(): string
    {
        return __('messages.reservation');
    }

    public static function getPluralModelLabel(): string
    {
        return __('messages.reservations');
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make(__('Customer Information'))->schema([
                Select::make('project_id')->label(__('Project'))->relationship(
                    name: 'project',
                    titleAttribute: 'name',
                    modifyQueryUsing: fn ($query) => $query->where('status', 'available')
                )
                    ->searchable()->preload()->required(),
                TextInput::make('customer_name')->label(__('Name'))->required()->maxLength(255),
                TextInput::make('customer_email')->label(__('Email'))->email()->required(),
                TextInput::make('customer_phone')->label(__('Phone'))->tel()->required(),
                Select::make('status')->label(__('Status'))->options([
                    'pending' => __('messages.reservation_status_pending'),
                    'accepted' => __('messages.reservation_status_accepted'),
                    'rejected' => __('messages.reservation_status_rejected'),
                ])->default('pending')->required(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return static::getDefaultTable($table)
            ->columns([
                TextColumn::make('project.name')->label(__('Project'))->searchable()->sortable()->badge(),
                TextColumn::make('customer_name')->label(__('Name'))->searchable()->sortable(),
                TextColumn::make('customer_email')->label(__('Email'))->searchable()->copyable(),
                TextColumn::make('customer_phone')->label(__('Phone'))->searchable()->copyable(),
                TextColumn::make('status')->label(__('Status'))->badge()->formatStateUsing(
                    fn (string $state): string => __('messages.reservation_status_'.$state)
                )->sortable(),
                TextColumn::make('created_at')->label(__('Date'))->dateTime('M j, Y H:i')->sortable(),
            ])
            ->filters([
                SelectFilter::make('project')->relationship('project', 'name')->searchable()->preload(),
                SelectFilter::make('status')->options([
                    'pending' => __('messages.reservation_status_pending'),
                    'accepted' => __('messages.reservation_status_accepted'),
                    'rejected' => __('messages.reservation_status_rejected'),
                ]),
            ]);
    }

    protected static function getListPage(): string
    {
        return Pages\ListReservations::class;
    }

    protected static function getCreatePage(): string
    {
        return Pages\CreateReservation::class;
    }

    protected static function getViewPage(): string
    {
        return Pages\ViewReservation::class;
    }

    protected static function getEditPage(): string
    {
        return Pages\EditReservation::class;
    }
}