<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProjectResource\Pages;
use App\Filament\Resources\ProjectResource\RelationManagers;
use App\Models\Project;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use UnitEnum;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-building-office-2';
    protected static string|UnitEnum|null $navigationGroup = 'Real Estate';
    protected static ?int $navigationSort = 1;
    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make(__('Basic Information'))->schema([
                TextInput::make('name')->label(__('Project Name'))->required()->maxLength(255)
                    ->live(onBlur: true)->afterStateUpdated(fn ($state, $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')->label(__('Slug'))->required()->maxLength(255)->unique(ignoreRecord: true),
                Select::make('type')->label(__('Property Type'))->options([
                    'apartment' => 'Apartment', 'villa' => 'Villa', 'townhouse' => 'Townhouse',
                    'penthouse' => 'Penthouse', 'duplex' => 'Duplex', 'commercial' => 'Commercial',
                ])->required()->searchable(),
                TextInput::make('location')->label(__('Location'))->required()->maxLength(255),
            ])->columns(2),
            Section::make(__('Property Details'))->schema([
                TextInput::make('price_starts_at')->label(__('Starting Price'))->required()->prefix('EGP'),
                TextInput::make('area_sqm')->label(__('Area'))->numeric()->suffix('m²'),
                TextInput::make('bedrooms')->label(__('Bedrooms'))->numeric(),
                TextInput::make('bathrooms')->label(__('Bathrooms'))->numeric(),
                Toggle::make('is_featured')->label(__('Featured')),
            ])->columns(3),
            Section::make(__('Description'))->schema([
                RichEditor::make('description')->label(__('Description'))->required()->columnSpanFull(),
            ]),
            Section::make(__('Media'))->schema([
                TextInput::make('image_url')->label(__('Image URL'))->url()->columnSpanFull(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label(__('Name'))->searchable()->sortable(),
                TextColumn::make('type')->label(__('Type'))->badge()->searchable()->sortable(),
                TextColumn::make('location')->label(__('Location'))->searchable()->toggleable(),
                TextColumn::make('price_starts_at')->label(__('Price'))->sortable(),
                IconColumn::make('is_featured')->label(__('Featured'))->boolean()->sortable(),
                TextColumn::make('created_at')->label(__('Created'))->dateTime('M j, Y')->sortable(),
            ])
            ->filters([
                SelectFilter::make('type')->options(['apartment' => 'Apartment', 'villa' => 'Villa']),
                TernaryFilter::make('is_featured')->label(__('Featured')),
            ])
            ->recordActions([ViewAction::make(), EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [RelationManagers\ReservationsRelationManager::class];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProjects::route('/'),
            'create' => Pages\CreateProject::route('/create'),
            'view' => Pages\ViewProject::route('/{record}'),
            'edit' => Pages\EditProject::route('/{record}/edit'),
        ];
    }
}
