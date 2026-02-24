<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(private ProjectService $projectService) {}

    /**
     * Display the gallery (home page) with all projects.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Projects/Index', $this->projectService->getIndexData($request->query()));
    }

    /**
     * Display a specific project's detail page.
     */
    public function show(Project $project): Response
    {
        return Inertia::render('Projects/Show', $this->projectService->getShowData($project));
    }
}
