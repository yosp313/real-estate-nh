<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display the gallery (home page) with all projects.
     */
    public function index(): Response
    {
        $projects = Project::all(['id', 'slug', 'name', 'price_starts_at', 'image_url']);

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Display a specific project's detail page.
     */
    public function show(Project $project): Response
    {
        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }
}
