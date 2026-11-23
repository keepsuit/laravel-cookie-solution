# AI providers

AI providers called from the server (for example through [`laravel/ai`](https://github.com/laravel/ai)) set no cookies, but they receive the content sent to the site's AI features. Register the providers the site uses, so they are listed in the privacy policy with their entity and data processing location.

```php
use Keepsuit\CookieSolution\ServiceFactories\OpenAI\OpenAIDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\OpenAI\OpenAIEntity;
use Keepsuit\CookieSolution\ServiceFactories\OpenAI\OpenAIServiceFactory;

$cookieSolution->register(
    OpenAIServiceFactory::new()
        ->entity(OpenAIEntity::IRELAND)
        ->location(OpenAIDataProcessingLocation::EUROPE)
        ->build()
);
```

## Factories

`->entity()` sets the provider's contracting entity: the default is the main one, pick the one named in the site's contract (e.g. the EEA entity). `->location()` sets where the data is processed. Factories without one of the two have a single value.

| `laravel/ai` provider | Factory | Entities (`->entity()`, default first) | Locations (`->location()`, default first) |
| --- | --- | --- | --- |
| `openai` | `OpenAI\OpenAIServiceFactory` | `OpenAIEntity`: `USA` (OpenAI OpCo, LLC), `IRELAND` (OpenAI Ireland Ltd.) | `OpenAIDataProcessingLocation`: `WORLDWIDE`, `EUROPE` (projects with European data residency, `eu.api.openai.com`) |
| `anthropic` | `Anthropic\AnthropicServiceFactory` | `AnthropicEntity`: `USA` (Anthropic, PBC), `IRELAND` (Anthropic Ireland, Limited) | `AnthropicDataProcessingLocation`: `WORLDWIDE`, `USA` (`us` inference geography) |
| `gemini` | `Google\GeminiServiceFactory` | `GeminiEntity` (by billing address): `USA` (Google LLC), `EMEA` (Google Cloud EMEA Limited, EMEA except France, Italy and Poland), `FRANCE` (Google Cloud France), `ITALY` (Google Cloud Italy S.r.l.), `POLAND` (Google Cloud Poland Sp. z o.o) | Worldwide |
| `azure` | `Microsoft\AzureOpenAIServiceFactory` | `MicrosoftEntity`: `USA` (Microsoft Corporation), `IRELAND` (Microsoft Ireland Operations Limited) | `AzureOpenAIDataProcessingLocation`: `WORLDWIDE` (Global deployment), `EUROPE`, `USA` (Data Zone deployments) |
| `bedrock` | `Amazon\AmazonBedrockServiceFactory` | `AmazonWebServicesEntity`: `USA` (Amazon Web Services, Inc.), `LUXEMBOURG` (Amazon Web Services EMEA SARL) | `AmazonWebServicesLocation::USA` (`us-east-1`, the `laravel/ai` default), any `AmazonWebServicesLocation`, or `DataProcessingArea::EUROPE` / `WORLDWIDE` for cross-region inference profiles |
| `mistral` | `Mistral\MistralServiceFactory` | Mistral AI | `MistralDataProcessingLocation`: `EUROPE`, `USA` (`api.us.mistral.ai`) |
| `xai` | `XAI\XAIServiceFactory` | SpaceX Super Intelligence LLC | `XAIDataProcessingLocation`: `WORLDWIDE`, `USA` (`us.api.x.ai`) |
| `groq` | `Groq\GroqServiceFactory` | `GroqEntity`: `USA` (Groq LLC), `UNITED_KINGDOM` (Groq UK Limited) | United States |
| `typesafe` | `TypeSafe\TypeSafeServiceFactory` | TypeSafe AI, Inc. | United States |
| `openrouter` | `OpenRouter\OpenRouterServiceFactory` | OpenRouter, Inc. | `OpenRouterDataProcessingLocation`: `WORLDWIDE`, `EUROPE` (EU in-region routing, `eu.openrouter.ai`) |
| — | `Cloudflare\CloudflareAiGatewayServiceFactory` | Cloudflare, Inc. | Worldwide |

All factories are in `Keepsuit\CookieSolution\ServiceFactories`. A location that is not a single country is shown as an area (`DataProcessingArea`: "Europe", "Worldwide"); use `DataProcessingArea::EUROPE->label()` for a `Service` built by hand.

## Gateways

OpenRouter and Cloudflare AI Gateway forward the requests to the model providers. As an indication, not legal advice:

- With the gateway's own key the site has a contract only with the gateway, and the model providers are its sub-processors: register the gateway.
- With the site's own provider key (BYOK) the site also has a contract with the model provider: register the gateway and the provider.

Cloudflare AI Gateway logs prompts and responses by default; logging can be turned off per gateway or per request.

## Zero data retention

The descriptions say nothing about retention or training, which depend on the site's contract. To state an agreement such as zero data retention, override the provider's translation (`cookie-solution::services.openai.description`) in the application.
