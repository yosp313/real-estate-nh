<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Available property types.
     */
    private array $propertyTypes = [
        'apartment',
        'villa',
        'townhouse',
        'duplex',
        'penthouse',
        'studio',
        'commercial',
    ];

    /**
     * Display the gallery (home page) with all projects.
     */
    public function index(Request $request): Response
    {
        $type = $request->string('type')->toString();
        $type = in_array($type, $this->propertyTypes, true) ? $type : null;

        $minAreaRaw = $request->query('min_area');
        $minArea = is_numeric($minAreaRaw) ? (int) $minAreaRaw : null;
        $minArea = $minArea !== null && $minArea >= 0 && $minArea <= 100000 ? $minArea : null;

        $projectSlug = $request->string('project')->toString();
        $projectSlug = $projectSlug !== '' && Project::where('slug', $projectSlug)->exists() ? $projectSlug : null;

        $query = Project::query();

        // Filter by type
        if ($type !== null) {
            $query->where('type', $type);
        }

        // Filter by minimum area
        if ($minArea !== null) {
            $query->where('area_sqm', '>=', $minArea);
        }

        // Filter by specific project slug
        if ($projectSlug !== null) {
            $query->where('slug', $projectSlug);
        }

        $projects = $query->get([
            'id',
            'slug',
            'name',
            'type',
            'area_sqm',
            'location',
            'bedrooms',
            'bathrooms',
            'is_featured',
            'price_starts_at',
            'image_url',
        ]);

        // Get all projects for the filter dropdown (unfiltered)
        $allProjects = Project::all(['id', 'slug', 'name']);

        // Get unique property types that exist in database
        $existingTypes = Project::distinct()->pluck('type')->filter()->toArray();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'allProjects' => $allProjects,
            'propertyTypes' => $this->propertyTypes,
            'existingTypes' => $existingTypes,
            'filters' => [
                'type' => $type,
                'min_area' => $minArea !== null ? (string) $minArea : null,
                'project' => $projectSlug,
            ],
        ]);
    }

    /**
     * Display a specific project's detail page.
     */
    public function show(Project $project): Response
    {
        // Get related projects (same type, excluding current)
        $relatedProjects = Project::where('type', $project->type)
            ->where('id', '!=', $project->id)
            ->limit(3)
            ->get(['id', 'slug', 'name', 'price_starts_at', 'image_url']);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'relatedProjects' => $relatedProjects,
        ]);
    }
}
