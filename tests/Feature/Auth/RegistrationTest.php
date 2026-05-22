<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_registration_screen_cannot_be_rendered_without_signature()
    {
        $response = $this->get(route('register'));

        $response->assertStatus(403);
    }

    public function test_registration_screen_can_be_rendered_with_signature()
    {
        $url = \Illuminate\Support\Facades\URL::signedRoute('register');
        $response = $this->get($url);

        $response->assertOk();
    }

    public function test_new_users_cannot_register_without_signature()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'username' => 'testuser',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(403);
        $this->assertGuest();
    }

    public function test_new_users_can_register_with_signature()
    {
        $url = \Illuminate\Support\Facades\URL::signedRoute('register');
        $response = $this->post($url, [
            'name' => 'Test User',
            'username' => 'testuser',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }
}
