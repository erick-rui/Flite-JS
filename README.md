# Flite Events Integration for Squarespace

A lightweight, configurable JavaScript library for displaying Flite events on Squarespace websites. This script fetches events from the Flite API and displays them in a responsive grid layout with separate sections for upcoming and past events.

## Features

- 🎨 **Fully Customizable** - Configure via data attributes or JavaScript
- 📱 **Responsive Design** - Automatically adapts to desktop, tablet, and mobile screens
- ⚡ **Fast & Lightweight** - No dependencies, pure vanilla JavaScript
- 🎯 **Easy Integration** - Simple copy-paste setup for Squarespace
- ✨ **Auto-Initialize** - Detects and initializes automatically with data attributes

## Quick Start

### Method 1: Data Attributes (Recommended)

The easiest way - just add data attributes to a div!

```html
<div class="flite-events" data-api="https://api-staging.flite.city/api/geteventsbyhost/your-host-name"></div>
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@main/flite-events-loader.js"></script>
```

Replace:
- `YOUR-USERNAME` with your GitHub username
- `YOUR-REPO` with your repository name
- `your-host-name` with your Flite host identifier

### Method 2: JavaScript Init

For more complex configurations:

```html
<div id="events-section"></div>

<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@main/flite-events-loader.js"></script>
<script>
  FliteEvents.init({
    apiEndpoint: 'https://api-staging.flite.city/api/geteventsbyhost/your-host-name'
  });
</script>
```

## Data Attributes Reference

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-api` | **Required** - Full API endpoint URL | - |
| `data-detail-url` | Pattern for event links (`{slug}` replaced) | `https://flite.city/e/{slug}` |
| `data-upcoming-heading` | Heading for upcoming events | "Upcoming Events" |
| `data-past-heading` | Heading for past events | "Past Events" |
| `data-cards-desktop` | # of columns on desktop | 3 |
| `data-cards-tablet` | # of columns on tablet | 2 |
| `data-cards-mobile` | # of columns on mobile | 1 |
| `data-past-events` | `"false"` disables past events section | `"true"` |
| `data-show-past` | `"true"` shows past events by default | `"false"` |
| `data-no-upcoming-text` | Message when no upcoming events | "No upcoming events found." |
| `data-no-past-text` | Message when no past events | "No past events found." |
| `data-no-events-text` | Message when no events at all | "No events found." |
| `data-error-text` | Error message for API failures | "Unable to load events..." |
| `data-show-past-button` | Text for "show past" button | "Show Past Events" |
| `data-hide-past-button` | Text for "hide past" button | "Hide Past Events" |
| `data-view-details-button` | Text for view button (upcoming) | "View Details" |
| `data-view-history-button` | Text for view button (past) | "View Event" |

## Common Use Cases

### Basic Setup

```html
<div class="flite-events" data-api="https://api-staging.flite.city/api/geteventsbyhost/my-venue"></div>
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@main/flite-events-loader.js"></script>
```

### Custom Layout (4 Columns)

```html
<div 
  class="flite-events"
  data-api="https://api-staging.flite.city/api/geteventsbyhost/my-venue"
  data-cards-desktop="4"
  data-cards-tablet="2"
  data-cards-mobile="1">
</div>
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@main/flite-events-loader.js"></script>
```

### Disable Past Events

```html
<div 
  class="flite-events"
  data-api="https://api-staging.flite.city/api/geteventsbyhost/my-venue"
  data-past-events="false">
</div>
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@main/flite-events-loader.js"></script>
```

### Show Past Events by Default

```html
<div 
  class="flite-events"
  data-api="https://api-staging.flite.city/api/geteventsbyhost/my-venue"
  data-show-past="true">
</div>
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@main/flite-events-loader.js"></script>
```

### Custom Headings and Text

```html
<div 
  class="flite-events"
  data-api="https://api-staging.flite.city/api/geteventsbyhost/my-venue"
  data-upcoming-heading="What's Coming Up"
  data-past-heading="Previous Shows"
  data-show-past-button="View History">
</div>
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@main/flite-events-loader.js"></script>
```

### Multi-language (Spanish)

```html
<div 
  class="flite-events"
  data-api="https://api-staging.flite.city/api/geteventsbyhost/my-venue"
  data-upcoming-heading="Próximos Eventos"
  data-past-heading="Eventos Pasados"
  data-show-past-button="Ver Eventos Pasados"
  data-hide-past-button="Ocultar Eventos Pasados"
  data-view-details-button="Ver Detalles">
</div>
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@main/flite-events-loader.js"></script>
```

### Multiple Event Sections

```html
<h2>Downtown Venue</h2>
<div 
  class="flite-events"
  data-api="https://api-staging.flite.city/api/geteventsbyhost/downtown-venue"
  data-upcoming-heading="Downtown - Upcoming Shows">
</div>

<h2>Uptown Venue</h2>
<div 
  class="flite-events"
  data-api="https://api-staging.flite.city/api/geteventsbyhost/uptown-venue"
  data-upcoming-heading="Uptown - Upcoming Shows">
</div>

<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@main/flite-events-loader.js"></script>
```

## JavaScript API (Advanced)

For complex configurations, use the JavaScript API:

### Basic Initialization

```javascript
FliteEvents.init({
  apiEndpoint: 'https://api-staging.flite.city/api/geteventsbyhost/your-host-name',
  eventDetailUrlPattern: 'https://flite.city/e/{slug}'
});
```

### Full Configuration Options

```javascript
FliteEvents.init({
  // Required
  apiEndpoint: 'string',              // API URL for fetching events
  
  // Optional
  eventDetailUrlPattern: 'string',    // URL pattern with {slug} placeholder
  containerId: 'string',              // ID of container div (default: 'events-section')
  showPastByDefault: boolean,         // Show past events on load (default: false)
  enablePastEvents: boolean,          // Enable/disable past events section (default: true)
  
  cardsPerRow: {
    desktop: number,                  // Cards per row on desktop (default: 3)
    tablet: number,                   // Cards per row on tablet (default: 2)
    mobile: number                    // Cards per row on mobile (default: 1)
  },
  
  headings: {
    upcoming: 'string',               // Upcoming events heading
    past: 'string',                   // Past events heading
    noUpcoming: 'string',             // No upcoming events message
    noPast: 'string',                 // No past events message
    noEvents: 'string',               // No events at all message
    error: 'string'                   // Error message
  },
  
  buttons: {
    showPast: 'string',               // Show past events button text
    hidePast: 'string',               // Hide past events button text
    viewDetails: 'string',            // View details button text
    viewHistory: 'string'             // View history button text (past events)
  }
});
```

### Multiple Instances with JavaScript

```javascript
FliteEvents.init({
  apiEndpoint: 'https://api-staging.flite.city/api/geteventsbyhost/venue-a',
  containerId: 'venue-a-events',
  headings: { upcoming: "Venue A Events" }
});

FliteEvents.init({
  apiEndpoint: 'https://api-staging.flite.city/api/geteventsbyhost/venue-b',
  containerId: 'venue-b-events',
  headings: { upcoming: "Venue B Events" }
});
```

## Using jsDelivr CDN

This setup uses jsDelivr to serve the script from GitHub:

- **Latest version**: `https://cdn.jsdelivr.net/gh/username/repo@main/flite-events-loader.js`
- **Specific version**: `https://cdn.jsdelivr.net/gh/username/repo@v1.1.0/flite-events-loader.js`
- **Specific commit**: `https://cdn.jsdelivr.net/gh/username/repo@commit-hash/flite-events-loader.js`

### Cache Considerations

- jsDelivr caches files for 7 days by default
- Use version tags (like `@v1.1.0`) for production
- Use `@main` for testing/development

## Updating the Script

1. Make changes to `flite-events-loader.js` in your repository
2. Commit and push to GitHub
3. Wait ~5-10 minutes for CDN cache to clear (or use a version tag)
4. Your Squarespace pages will automatically use the updated script

## Comparison: Data Attributes vs JavaScript

| Feature | Data Attributes | JavaScript Init |
|---------|----------------|-----------------|
| **Ease of Use** | ⭐⭐⭐⭐⭐ Very Easy | ⭐⭐⭐ Moderate |
| **Setup Speed** | Instant | Requires scripting |
| **Readability** | Highly readable | More technical |
| **Multiple Instances** | Copy & paste divs | Multiple init calls |
| **Best For** | Most use cases | Complex configurations |
| **Auto-Initialize** | Yes | No |

**Recommendation**: Use data attributes for 90% of use cases. Only use JavaScript init when you need programmatic control or very complex configurations.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Events Not Showing

1. Check browser console for errors (F12)
2. Verify your API endpoint is correct
3. Ensure the script is loading (check Network tab)
4. Check if the Flite API is accessible

### Data Attributes Not Working

1. Ensure you have `data-api` attribute (required)
2. Check that the script is loaded AFTER the div
3. Verify attribute names match exactly (case-sensitive)
4. Boolean values must be strings: `data-show-past="true"` not `data-show-past=true`

### Styling Issues

The script includes default dark theme styling. To customize:
- Add custom CSS in Squarespace's Custom CSS section
- Target classes: `.events-grid`, `.event-card`, `.past-event`

### Script Not Loading

1. Verify jsDelivr URL is correct
2. Check GitHub repository is public
3. Wait a few minutes after pushing changes
4. Try clearing browser cache

### Multiple Sections Not Working

Each div must either:
- Have unique `id` attribute (auto-generated if missing)
- Or use `flite-events` attribute (recommended)

## Styling Customization

Add custom CSS to override default styles:

```css
/* Change card background */
.event-card {
  background-color: #1a1a1a !important;
}

/* Customize upcoming event cards */
.event-card:not(.past-event) {
  border-color: #0066cc !important;
}

/* Style past events differently */
.past-event {
  opacity: 0.5 !important;
}

/* Adjust grid spacing */
.events-grid {
  gap: 30px !important;
  padding: 30px !important;
}
```

## License

MIT License - feel free to use and modify for your projects.

## Support

For issues related to:
- **This script**: Open an issue on GitHub
- **Flite API**: Contact Flite support
- **Squarespace**: Contact Squarespace support

## Version History

- **1.1.0** - Added data attributes support for auto-initialization
  - New: Auto-detect and initialize divs with `flite-events` attribute
  - New: 16+ data attributes for configuration
  - New: `enablePastEvents` option to disable past events section
  - Improved: Better error handling and validation
  
- **1.0.0** - Initial release
  - Responsive grid layout
  - Upcoming/past event separation
  - Full configuration support
  - Multi-language support
