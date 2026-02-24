<?php

namespace App\Filament\Resources\ProjectResource\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ReservationsRelationManager extends RelationManager
{
    protected static string $relationship = 'reservations';

    protected static ?string $recordTitleAttribute = 'customer_name';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('customer_name')->label(__('Name'))->required()->maxLength(255),
            TextInput::make('customer_email')->label(__('Email'))->email()->required(),
            TextInput::make('customer_phone')->label(__('Phone'))->tel()->required(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('customer_name')->label(__('Name'))->searchable()->sortable(),
                TextColumn::make('customer_email')->label(__('Email'))->searchable()->copyable(),
                TextColumn::make('customer_phone')->label(__('Phone'))->searchable()->copyable(),
                TextColumn::make('created_at')->label(__('Date'))->dateTime('M j, Y H:i')->sortable(),
            ])
            ->headerActions([CreateAction::make()])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])])
            ->defaultSort('created_at', 'desc');
    }
}
