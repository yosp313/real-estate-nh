<?php

namespace App\Filament\Resources;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;
use UnitEnum;

abstract class BaseResource extends Resource
{
    protected static string|UnitEnum|null $navigationGroup = 'Real Estate';

    public static function getPages(): array
    {
        return [
            'index' => static::getListPage()::route('/'),
            'create' => static::getCreatePage()::route('/create'),
            'view' => static::getViewPage()::route('/{record}'),
            'edit' => static::getEditPage()::route('/{record}/edit'),
        ];
    }

    abstract protected static function getListPage(): string;
    abstract protected static function getCreatePage(): string;
    abstract protected static function getViewPage(): string;
    abstract protected static function getEditPage(): string;

    protected static function getDefaultTableActions(): array
    {
        return [ViewAction::make(), EditAction::make(), DeleteAction::make()];
    }

    protected static function getDefaultToolbarActions(): array
    {
        return [BulkActionGroup::make([DeleteBulkAction::make()])];
    }

    protected static function getDefaultTable(Table $table): Table
    {
        return $table
            ->recordActions(static::getDefaultTableActions())
            ->toolbarActions(static::getDefaultToolbarActions())
            ->defaultSort('created_at', 'desc');
    }
}