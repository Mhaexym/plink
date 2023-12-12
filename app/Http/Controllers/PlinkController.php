<?php

namespace App\Http\Controllers;

use App\Models\Plink;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Validator;

class PlinkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return (
            Inertia::render('Plinkpage')
            //
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //password should be no longer than 50, rest of validation is handled in front-end.
        $rules = ['sharedPassword' => ['required', 'string', 'max:50']];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect(route('plink.index'));
        }

        // Generate a uuid for a unique link and couple it with the password in a single plink db entry.
        $uuid = Str::Uuid();
        Plink::create([
            'sharedPassword' => $request->input('sharedPassword'),
            'uuid' => $uuid,
            'uses' => $request->input('uses'),
            'hoursLeft' => $request->input('hoursLeft')
            // Add other attributes as needed
        ]);

        // Return the link's uuid. 
        return Inertia::render('Plinkpage', ['uuid' => $uuid]);
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        // Retrieve uuid from url, and get all data needed to confirm password retrieval
        $str = $_SERVER['REQUEST_URI'];
        $str = ltrim($str, '/');
        $plink = Plink::where('uuid', '=', $str);
        $uses = $plink->get('uses');
        $requestedPassword = $plink->get('sharedPassword');
        $createdAt = $plink->get('created_at');
        $hoursLeft = $plink->get('hoursLeft');

        // If item was already deleted, we return passwordExpired = true
        if (count($createdAt) == 0) {
            return Inertia::render('Plinkpage', ['passwordExpired' => true]);
        } else {
            // Check if the max. number of hours have passed since creation, if so: delete plink and give passwordExpired = true;
            $createdAt = $createdAt['0']['created_at'];
            $hoursLeft = $hoursLeft['0']['hoursLeft'];
            $date = date('Y-m-d h:i:s', time());
            $createdAt->modify("+ $hoursLeft hours");

            if ($date > $createdAt) {
                $plink->delete();
                return Inertia::render('Plinkpage', ['passwordExpired' => true]);
            }
        }
        // If no more uses left we delete the object
        if (count($uses) == 0) {
            return Inertia::render('Plinkpage', ['passwordExpired' => true]);
        } else {
            // Else: if there is only a single use left, then this is that use, and we delete the plink.
            $uses = $uses['0']['uses'];
            if ($uses == 1) {
                $plink->delete();
            }
            $plink->update(['uses' => $uses - 1]);
            $requestedPassword = $requestedPassword['0']['sharedPassword'];
        }

        // If all went well, we return the plink with the requested password.
        return (
            Inertia::render('Plinkpage', ['requestedPassword' => $requestedPassword])
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Plink $plink)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Plink $plink)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plink $plink)
    {
        //
    }
}
