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
                'slug' => 'future-garden-compound',
                'name' => 'Future Garden Compound',
                'description' => "كمبوند فيوتشر جاردن — شارع 23 يوليو - المستقبل - فيصل - السويس\n\nBuilt in 2020. 270 residential units.\n\nFeatures:\n• Multi-storey commercial mall\n• Range of shops and administrative offices\n• Industrial lake\n• Gymnasium\n• Bank complex and medical center\n• Children's nursery\n• Landscapes and recreational areas\n• Underground garage",
                'type' => 'compound',
                'area_sqm' => null,
                'location' => 'شارع 23 يوليو - المستقبل - فيصل - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => true,
                'status' => 'available',
                'price_starts_at' => null,
                'image_url' => null,
            ],
            [
                'slug' => 'asaad-compound',
                'name' => 'Asaad Compound',
                'description' => "مجمع أسعد السكني — شارع الأسماعيلية - الجناين\n\nBuilt in 2016. 200 residential units.\n\nFeatures:\n• Range of shops and pharmacies\n• Underground garage\n• Landscape",
                'type' => 'compound',
                'area_sqm' => null,
                'location' => 'شارع الأسماعيلية - الجناين',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => true,
                'status' => 'available',
                'price_starts_at' => null,
                'image_url' => null,
            ],
            [
                'slug' => 'al-nader-palace',
                'name' => 'Al-Nader Palace',
                'description' => "قصر النادر — أمام مسجد حمزة بن عبدالمطلب - فيصل - السويس\n\nBuilt in 2018. 25 residential units.\n\nFeatures:\n• Range of shops",
                'type' => 'apartment',
                'area_sqm' => null,
                'location' => 'أمام مسجد حمزة بن عبدالمطلب - فيصل - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => false,
                'status' => 'available',
                'price_starts_at' => null,
                'image_url' => null,
            ],
            [
                'slug' => 'al-nader-building',
                'name' => 'Al-Nader Building',
                'description' => "عمارة النادر — تعاونيات القاهرة - امام مجمع مخابز فيصل - السويس\n\nBuilt in 2013. 20 residential units.\n\nFeatures:\n• Range of shops",
                'type' => 'apartment',
                'area_sqm' => null,
                'location' => 'تعاونيات القاهرة - امام مجمع مخابز فيصل - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => false,
                'status' => 'available',
                'price_starts_at' => null,
                'image_url' => null,
            ],
            [
                'slug' => 'al-nader-tower-1',
                'name' => 'Al-Nader Tower 1',
                'description' => "برج النادر 1 — شارع الجيش - الاربعين - السويس\n\nBuilt in 2012. 27 residential units.\n\nFeatures:\n• Bank\n• Range of shops",
                'type' => 'apartment',
                'area_sqm' => null,
                'location' => 'شارع الجيش - الاربعين - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => false,
                'status' => 'available',
                'price_starts_at' => null,
                'image_url' => null,
            ],
            [
                'slug' => 'al-nader-tower-2',
                'name' => 'Al-Nader Tower 2',
                'description' => "برج النادر 2 — ميدان الملك فيصل - أمام حي فيصل - السويس\n\nBuilt in 2014. 44 residential units.\n\nFeatures:\n• Hyperbim\n• Range of shops",
                'type' => 'apartment',
                'area_sqm' => null,
                'location' => 'ميدان الملك فيصل - أمام حي فيصل - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => false,
                'status' => 'available',
                'price_starts_at' => null,
                'image_url' => null,
            ],
            [
                'slug' => 'middle-east-tower',
                'name' => 'Al-Nader Building (Middle East Tower)',
                'description' => "برج الشرق الأوسط — شارع الجيش - الاربعين - السويس (460)\n\nBuilt in 2010. 36 residential units.\n\nFeatures:\n• 2 Commercial Malls",
                'type' => 'apartment',
                'area_sqm' => null,
                'location' => 'شارع الجيش - الاربعين - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => false,
                'status' => 'available',
                'price_starts_at' => null,
                'image_url' => null,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
