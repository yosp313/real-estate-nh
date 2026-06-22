<?php

namespace App\Enums;

enum PropertyType: string
{
    case Apartment = 'apartment';
    case Villa = 'villa';
    case Townhouse = 'townhouse';
    case Duplex = 'duplex';
    case Penthouse = 'penthouse';
    case Studio = 'studio';
    case Commercial = 'commercial';

    public function label(): string
    {
        return match ($this) {
            self::Apartment => __('messages.apartment'),
            self::Villa => __('messages.villa'),
            self::Townhouse => __('messages.townhouse'),
            self::Duplex => __('messages.duplex'),
            self::Penthouse => __('messages.penthouse'),
            self::Studio => __('messages.studio'),
            self::Commercial => __('messages.commercial'),
        };
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn ($type) => [$type->value => $type->label()])
            ->toArray();
    }
}
