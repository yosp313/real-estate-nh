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
    ];

    /**
     * Display the gallery (home page) with all projects.
     */
    public function index(Request $request): Response
    {
        $query = Project::query();

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by minimum area
        if ($request->filled('min_area')) {
            $query->where('area_sqm', '>=', (int) $request->min_area);
        }

        // Filter by specific project slug
        if ($request->filled('project')) {
            $query->where('slug', $request->project);
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
            'image_url'
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
                'type' => $request->type,
                'min_area' => $request->min_area,
                'project' => $request->project,
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
