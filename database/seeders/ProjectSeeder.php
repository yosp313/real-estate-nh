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
                'area_sqm' => 85000,
                'location' => 'شارع 23 يوليو - المستقبل - فيصل - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => true,
                'status' => 'available',
                'price_starts_at' => 1200000,
                'image_url' => 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&q=80',
            ],
            [
                'slug' => 'asaad-compound',
                'name' => 'Asaad Compound',
                'description' => "مجمع أسعد السكني — شارع الأسماعيلية - الجناين\n\nBuilt in 2016. 200 residential units.\n\nFeatures:\n• Range of shops and pharmacies\n• Underground garage\n• Landscape",
                'type' => 'compound',
                'area_sqm' => 62000,
                'location' => 'شارع الأسماعيلية - الجناين',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => true,
                'status' => 'available',
                'price_starts_at' => 950000,
                'image_url' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80',
            ],
            [
                'slug' => 'al-nader-palace',
                'name' => 'Al-Nader Palace',
                'description' => "قصر النادر — أمام مسجد حمزة بن عبدالمطلب - فيصل - السويس\n\nBuilt in 2018. 25 residential units.\n\nFeatures:\n• Range of shops",
                'type' => 'apartment',
                'area_sqm' => 120,
                'location' => 'أمام مسجد حمزة بن عبدالمطلب - فيصل - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => false,
                'status' => 'available',
                'price_starts_at' => 780000,
                'image_url' => 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
            ],
            [
                'slug' => 'al-nader-building',
                'name' => 'Al-Nader Building',
                'description' => "عمارة النادر — تعاونيات القاهرة - امام مجمع مخابز فيصل - السويس\n\nBuilt in 2013. 20 residential units.\n\nFeatures:\n• Range of shops",
                'type' => 'apartment',
                'area_sqm' => 100,
                'location' => 'تعاونيات القاهرة - امام مجمع مخابز فيصل - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => false,
                'status' => 'available',
                'price_starts_at' => 620000,
                'image_url' => 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80',
            ],
            [
                'slug' => 'al-nader-tower-1',
                'name' => 'Al-Nader Tower 1',
                'description' => "برج النادر 1 — شارع الجيش - الاربعين - السويس\n\nBuilt in 2012. 27 residential units.\n\nFeatures:\n• Bank\n• Range of shops",
                'type' => 'apartment',
                'area_sqm' => 110,
                'location' => 'شارع الجيش - الاربعين - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => false,
                'status' => 'available',
                'price_starts_at' => 650000,
                'image_url' => 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1600&q=80',
            ],
            [
                'slug' => 'al-nader-tower-2',
                'name' => 'Al-Nader Tower 2',
                'description' => "برج النادر 2 — ميدان الملك فيصل - أمام حي فيصل - السويس\n\nBuilt in 2014. 44 residential units.\n\nFeatures:\n• Hyperbim\n• Range of shops",
                'type' => 'apartment',
                'area_sqm' => 130,
                'location' => 'ميدان الملك فيصل - أمام حي فيصل - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => false,
                'status' => 'available',
                'price_starts_at' => 720000,
                'image_url' => 'https://images.unsplash.com/photo-1499916078039-922301b0eb9b?w=1600&q=80',
            ],
            [
                'slug' => 'middle-east-tower',
                'name' => 'Al-Nader Building (Middle East Tower)',
                'description' => "برج الشرق الأوسط — شارع الجيش - الاربعين - السويس (460)\n\nBuilt in 2010. 36 residential units.\n\nFeatures:\n• 2 Commercial Malls",
                'type' => 'apartment',
                'area_sqm' => 115,
                'location' => 'شارع الجيش - الاربعين - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => false,
                'status' => 'available',
                'price_starts_at' => 680000,
                'image_url' => 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1600&q=80',
            ],
            [
                'slug' => 'nh-furniture-house',
                'name' => 'NH Furniture House',
                'description' => "ان اتش فرنيتشر هاوس — كمبوند فيوتشر جاردن - المستقبل - فيصل - السويس\n\nNH Furniture House is the largest place that brings together everything related to the home in one place, including Home Furniture, Carpets, Kitchens, Outdoor Furniture, Lighting, Curtains, home accessories, Mattress of the highest quality and the best price.\n\nان اتش فرنيتشر هاوس هو أكبر مكان يجمع كل ما يتعلق بالمنزل في مكان واحد بما في ذلك أثاث المنزل، السجاد، المطابخ، أثاث الحدائق، الإضاءة، الستائر، اكسسوارات المنزل، المراتب بأعلى جودة وأفضل سعر.",
                'type' => 'commercial',
                'area_sqm' => 4500,
                'location' => 'كمبوند فيوتشر جاردن - المستقبل - فيصل - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => true,
                'status' => 'available',
                'price_starts_at' => 3500000,
                'image_url' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80',
            ],
            [
                'slug' => 'nh-fitness-club',
                'name' => 'NH Fitness Club',
                'description' => "ان اتش فيتنس — كمبوند فيوتشر جاردن - المستقبل - فيصل - السويس\n\nNH Fitness Training: Where high-class equipment meets mega space and expert trainers. Your ultimate fitness destination awaits…!\n\nصالة جيمانيزيوم / مركز لياقة بدنية\n\nان اتش فيتنس للتدريب الرياضي: حيث تلتقي المعدات الفاخرة بالمساحات الواسعة والمدربين الخبراء وجهتك المثالية للياقة البدنية في انتظارك...!",
                'type' => 'commercial',
                'area_sqm' => 2800,
                'location' => 'كمبوند فيوتشر جاردن - المستقبل - فيصل - السويس',
                'bedrooms' => null,
                'bathrooms' => null,
                'is_featured' => true,
                'status' => 'available',
                'price_starts_at' => 2200000,
                'image_url' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
            ],
        ];

        foreach ($projects as $project) {
            Project::updateOrCreate(['slug' => $project['slug']], $project);
        }
    }
}
