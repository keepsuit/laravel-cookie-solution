<?php

it('does not register the endpoints by default', function () {
    $this->getJson('/cookie-solution')->assertNotFound();
    $this->getJson('/cookie-solution/policies')->assertNotFound();
    $this->getJson('/internal/cookie-solution')->assertNotFound();
});
