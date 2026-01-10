<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'slug' => 'palm-grove-villas',
                'name' => 'Palm Grove Villas',
                'description' => "Experience luxury living in our exclusive Palm Grove Villas community. Each villa features:\n\n• 4-5 spacious bedrooms with en-suite bathrooms\n• Modern open-plan living and dining areas\n• Private swimming pool and landscaped garden\n• Gated community with 24/7 security\n• Close proximity to schools, shopping centers, and major highways\n• Premium finishing and smart home features\n\nNestled in a quiet neighborhood, Palm Grove Villas offers the perfect blend of privacy, luxury, and convenience for families seeking an upscale lifestyle.",
                'type' => 'villa',
                'area_sqm' => 450,
                'location' => 'New Cairo',
                'bedrooms' => 5,
                'bathrooms' => 4,
                'is_featured' => true,
                'price_starts_at' => '450,000',
                'image_url' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'ocean-breeze-residences',
                'name' => 'Ocean Breeze Residences',
                'description' => "Wake up to stunning ocean views at Ocean Breeze Residences. Our premium beachfront compound offers:\n\n• 3-4 bedroom luxury apartments and penthouses\n• Floor-to-ceiling windows with panoramic sea views\n• Infinity pool overlooking the ocean\n• State-of-the-art fitness center and spa\n• Private beach access\n• Concierge services and valet parking\n• Walking distance to marina and waterfront restaurants\n\nPerfect for those who appreciate coastal living with world-class amenities and breathtaking views.",
                'type' => 'penthouse',
                'area_sqm' => 320,
                'location' => 'North Coast',
                'bedrooms' => 4,
                'bathrooms' => 3,
                'is_featured' => true,
                'price_starts_at' => '650,000',
                'image_url' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'mountain-view-estates',
                'name' => 'Mountain View Estates',
                'description' => "Discover tranquility in our Mountain View Estates, where nature meets luxury:\n\n• 5-6 bedroom custom-designed homes\n• Spectacular mountain and valley views\n• Large plots ranging from 1-2 acres\n• Private hiking trails and nature reserves\n• Clubhouse with restaurant and entertainment facilities\n• Tennis courts and children's play areas\n• Sustainable architecture with solar panels\n\nIdeal for families seeking space, privacy, and a connection with nature while enjoying modern conveniences.",
                'type' => 'villa',
                'area_sqm' => 550,
                'location' => 'Ain Sokhna',
                'bedrooms' => 6,
                'bathrooms' => 5,
                'is_featured' => false,
                'price_starts_at' => '550,000',
                'image_url' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'urban-loft-collection',
                'name' => 'Urban Loft Collection',
                'description' => "Contemporary living in the heart of the city. Urban Loft Collection features:\n\n• 1-3 bedroom modern lofts with high ceilings\n• Industrial-chic design with exposed brick and concrete\n• Rooftop terrace with city skyline views\n• Co-working spaces and business lounge\n• Pet-friendly facilities\n• Walking distance to metro, cafes, and cultural venues\n• Smart building technology\n\nPerfect for young professionals and urban enthusiasts who want to live in the pulse of the city.",
                'type' => 'apartment',
                'area_sqm' => 150,
                'location' => 'Downtown Cairo',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'is_featured' => true,
                'price_starts_at' => '320,000',
                'image_url' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'serenity-gardens',
                'name' => 'Serenity Gardens',
                'description' => "A peaceful oasis for retirement or family living. Serenity Gardens provides:\n\n• 2-4 bedroom single-story homes\n• Barrier-free design and accessibility features\n• Extensive community gardens and green spaces\n• Swimming pool, yoga pavilion, and wellness center\n• Social club and activity programs\n• On-site medical services\n• Pet-friendly environment with dog park\n\nDesigned for comfort, community, and well-being in a serene, garden-like setting.",
                'type' => 'townhouse',
                'area_sqm' => 280,
                'location' => '6th of October',
                'bedrooms' => 3,
                'bathrooms' => 3,
                'is_featured' => false,
                'price_starts_at' => '380,000',
                'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'lakeside-manor',
                'name' => 'Lakeside Manor',
                'description' => "Waterfront luxury at its finest. Lakeside Manor offers:\n\n• 4-6 bedroom estate homes on lakefront lots\n• Private boat docks and water sports facilities\n• Championship golf course\n• Equestrian center and riding trails\n• Lakeside clubhouse with fine dining\n• 24-hour security and gated entry\n• Custom home design options available\n\nAn exclusive community for discerning buyers seeking the ultimate in waterfront estate living.",
                'type' => 'villa',
                'area_sqm' => 650,
                'location' => 'Madinaty',
                'bedrooms' => 6,
                'bathrooms' => 6,
                'is_featured' => true,
                'price_starts_at' => '850,000',
                'image_url' => 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'city-center-studios',
                'name' => 'City Center Studios',
                'description' => "Modern studio apartments perfect for singles and couples:\n\n• Open-plan studio and 1-bedroom layouts\n• Fully fitted kitchens\n• Building amenities including gym and rooftop pool\n• Prime location near business district\n• Underground parking\n• 24-hour security\n\nIdeal for investors or first-time buyers seeking value in a prime location.",
                'type' => 'studio',
                'area_sqm' => 65,
                'location' => 'Zamalek',
                'bedrooms' => 0,
                'bathrooms' => 1,
                'is_featured' => false,
                'price_starts_at' => '180,000',
                'image_url' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'golden-dunes-duplex',
                'name' => 'Golden Dunes Duplex',
                'description' => "Spacious duplex units with stunning desert views:\n\n• 3-4 bedroom duplex layouts\n• Private terraces on both levels\n• Modern finishes throughout\n• Community pool and clubhouse\n• Near golf courses and leisure facilities\n• Gated compound with security\n\nPerfect for families who want space and style.",
                'type' => 'duplex',
                'area_sqm' => 350,
                'location' => 'Sheikh Zayed',
                'bedrooms' => 4,
                'bathrooms' => 3,
                'is_featured' => false,
                'price_starts_at' => '520,000',
                'image_url' => 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop',
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
