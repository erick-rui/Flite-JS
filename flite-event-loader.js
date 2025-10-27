// Flite Events Integration Script
// Version 1.1.0
// Usage: Initialize with FliteEvents.init() OR use data attributes on div

(function() {
  'use strict';

  // Default configuration
  const DEFAULT_CONFIG = {
    apiEndpoint: 'https://api-staging.flite.city/api/geteventsbyhost/sway-hospitality',
    eventDetailUrlPattern: 'https://flite.city/e/{slug}',
    cardsPerRow: {
      desktop: 3,
      tablet: 2,
      mobile: 1
    },
    headings: {
      upcoming: "Upcoming Events",
      past: "Past Events",
      noUpcoming: "No upcoming events found.",
      noPast: "No past events found.",
      noEvents: "No events found.",
      error: "Unable to load events at this time. Please try again later."
    },
    buttons: {
      showPast: "Show Past Events",
      hidePast: "Hide Past Events",
      viewDetails: "View Details",
      viewHistory: "View Event"
    },
    containerId: 'events-section',
    showPastByDefault: false,
    enablePastEvents: true
  };

  // Parse data attributes from a container element
  function parseDataAttributes(element) {
    const config = {};
    
    // Required: API endpoint
    if (element.dataset.api) {
      config.apiEndpoint = element.dataset.api;
    }
    
    // Optional: Event detail URL pattern
    if (element.dataset.detailUrl) {
      config.eventDetailUrlPattern = element.dataset.detailUrl;
    }
    
    // Optional: Cards per row settings
    if (element.dataset.cardsDesktop || element.dataset.cardsTablet || element.dataset.cardsMobile) {
      config.cardsPerRow = {};
      if (element.dataset.cardsDesktop) {
        config.cardsPerRow.desktop = parseInt(element.dataset.cardsDesktop, 10);
      }
      if (element.dataset.cardsTablet) {
        config.cardsPerRow.tablet = parseInt(element.dataset.cardsTablet, 10);
      }
      if (element.dataset.cardsMobile) {
        config.cardsPerRow.mobile = parseInt(element.dataset.cardsMobile, 10);
      }
    }
    
    // Optional: Headings
    if (element.dataset.upcomingHeading || element.dataset.pastHeading || 
        element.dataset.noUpcomingText || element.dataset.noPastText ||
        element.dataset.noEventsText || element.dataset.errorText) {
      config.headings = {};
      if (element.dataset.upcomingHeading) {
        config.headings.upcoming = element.dataset.upcomingHeading;
      }
      if (element.dataset.pastHeading) {
        config.headings.past = element.dataset.pastHeading;
      }
      if (element.dataset.noUpcomingText) {
        config.headings.noUpcoming = element.dataset.noUpcomingText;
      }
      if (element.dataset.noPastText) {
        config.headings.noPast = element.dataset.noPastText;
      }
      if (element.dataset.noEventsText) {
        config.headings.noEvents = element.dataset.noEventsText;
      }
      if (element.dataset.errorText) {
        config.headings.error = element.dataset.errorText;
      }
    }
    
    // Optional: Button labels
    if (element.dataset.showPastButton || element.dataset.hidePastButton ||
        element.dataset.viewDetailsButton || element.dataset.viewHistoryButton) {
      config.buttons = {};
      if (element.dataset.showPastButton) {
        config.buttons.showPast = element.dataset.showPastButton;
      }
      if (element.dataset.hidePastButton) {
        config.buttons.hidePast = element.dataset.hidePastButton;
      }
      if (element.dataset.viewDetailsButton) {
        config.buttons.viewDetails = element.dataset.viewDetailsButton;
      }
      if (element.dataset.viewHistoryButton) {
        config.buttons.viewHistory = element.dataset.viewHistoryButton;
      }
    }
    
    // Optional: Show past events by default
    if (element.dataset.showPast !== undefined) {
      config.showPastByDefault = element.dataset.showPast === 'true';
    }
    
    // Optional: Enable/disable past events section
    if (element.dataset.pastEvents !== undefined) {
      config.enablePastEvents = element.dataset.pastEvents !== 'false';
    }
    
    return config;
  }

  // Auto-initialize elements with data-api attribute
  function autoInit() {
    const elements = document.querySelectorAll('.flite-events');
    elements.forEach(element => {
      if (!element.dataset.fliteInitialized) {
        const config = parseDataAttributes(element);
        config.containerId = element.id || 'events-section-' + Math.random().toString(36).substr(2, 9);
        if (!element.id) {
          element.id = config.containerId;
        }
        element.dataset.fliteInitialized = 'true';
        FliteEvents.render(config);
      }
    });
  }

  // Main initialization function
  window.FliteEvents = {
    init: function(userConfig) {
      const config = Object.assign({}, DEFAULT_CONFIG, userConfig);
      
      // Merge nested objects properly
      if (userConfig.cardsPerRow) {
        config.cardsPerRow = Object.assign({}, DEFAULT_CONFIG.cardsPerRow, userConfig.cardsPerRow);
      }
      if (userConfig.headings) {
        config.headings = Object.assign({}, DEFAULT_CONFIG.headings, userConfig.headings);
      }
      if (userConfig.buttons) {
        config.buttons = Object.assign({}, DEFAULT_CONFIG.buttons, userConfig.buttons);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.render(config));
      } else {
        this.render(config);
      }
    },

    render: function(userConfig) {
      // Merge with defaults
      const config = Object.assign({}, DEFAULT_CONFIG, userConfig);
      if (userConfig.cardsPerRow) {
        config.cardsPerRow = Object.assign({}, DEFAULT_CONFIG.cardsPerRow, userConfig.cardsPerRow);
      }
      if (userConfig.headings) {
        config.headings = Object.assign({}, DEFAULT_CONFIG.headings, userConfig.headings);
      }
      if (userConfig.buttons) {
        config.buttons = Object.assign({}, DEFAULT_CONFIG.buttons, userConfig.buttons);
      }

      const eventsSection = document.querySelector(`#${config.containerId}`);
      if (!eventsSection) {
        console.error(`FliteEvents: Container #${config.containerId} not found`);
        return;
      }

      // Clear existing content
      eventsSection.innerHTML = '';

      // Add styles if not already added
      if (!document.getElementById('flite-events-styles')) {
        this.addStyles();
      }

      // Create upcoming events container
      const upcomingEventsContainer = this.createEventsGrid('upcoming-events', config);
      
      // Create past events container (only if enabled)
      let pastEventsContainer = null;
      let toggleButton = null;
      
      if (config.enablePastEvents) {
        pastEventsContainer = this.createEventsGrid('past-events', config);
        
        // Create heading for past events
        const pastHeading = document.createElement("h2");
        pastHeading.textContent = config.headings.past;
        pastHeading.style.gridColumn = "1 / -1";
        pastHeading.style.margin = "0 0 20px 0";
        pastHeading.style.fontSize = "28px";
        pastHeading.style.color = "#ffffff";
        pastEventsContainer.appendChild(pastHeading);
      }

      // Fetch and display events
      this.fetchEvents(config, upcomingEventsContainer, pastEventsContainer);

      // Add containers to the page
      eventsSection.appendChild(upcomingEventsContainer);

      if (config.enablePastEvents && pastEventsContainer) {
        // Create toggle button
        toggleButton = this.createToggleButton(config, pastEventsContainer);
        eventsSection.appendChild(toggleButton);
        eventsSection.appendChild(pastEventsContainer);

        // Set initial visibility for past events
        pastEventsContainer.style.display = config.showPastByDefault ? "grid" : "none";
        toggleButton.textContent = config.showPastByDefault ? config.buttons.hidePast : config.buttons.showPast;
      }

      // Setup responsive grid
      this.setupResponsiveGrid(config, upcomingEventsContainer, pastEventsContainer);
    },

    createEventsGrid: function(className, config) {
      const container = document.createElement("div");
      container.className = `events-grid ${className}`;
      container.style.display = "grid";
      container.style.gridTemplateColumns = `repeat(auto-fill, minmax(calc(100% / ${config.cardsPerRow.desktop} - 20px), 1fr))`;
      container.style.gap = "20px";
      container.style.padding = "20px";
      if (className === 'past-events') {
        container.style.marginTop = "40px";
      }
      return container;
    },

    createEventCard: function(event, isPast, config) {
      const eventCard = document.createElement("div");
      eventCard.className = isPast ? "event-card past-event" : "event-card";
      eventCard.style.border = "1px solid #333";
      eventCard.style.borderRadius = "8px";
      eventCard.style.overflow = "hidden";
      eventCard.style.boxShadow = "0 4px 10px rgba(0,0,0,0.5)";
      eventCard.style.backgroundColor = "#222";
      eventCard.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";

      if (isPast) {
        eventCard.style.opacity = "0.6";
        eventCard.style.filter = "grayscale(80%)";
      }

      // Add event image if available
      if (event.hostFlyer && event.hostFlyer.length > 0) {
        const eventImage = document.createElement("img");
        eventImage.src = event.hostFlyer[0];
        eventImage.alt = event.eventName;
        eventImage.style.width = "100%";
        eventImage.style.height = "200px";
        eventImage.style.objectFit = "cover";
        eventCard.appendChild(eventImage);
      }

      // Add event details
      const eventDetails = document.createElement("div");
      eventDetails.className = "event-details";
      eventDetails.style.padding = "15px";

      // Event name
      const eventName = document.createElement("h3");
      eventName.textContent = event.eventName;
      eventName.style.margin = "0 0 10px 0";
      eventName.style.fontSize = "18px";
      eventName.style.color = isPast ? "#aaa" : (event.color || "#fff");
      eventDetails.appendChild(eventName);

      // Event date and time
      const eventDateTime = document.createElement("p");
      const startDate = new Date(event.startDateTime);
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      eventDateTime.textContent = startDate.toLocaleDateString('en-US', options);
      eventDateTime.style.margin = "5px 0";
      eventDateTime.style.fontSize = "14px";
      eventDateTime.style.color = "#ccc";
      eventDetails.appendChild(eventDateTime);

      // Venue
      const eventVenue = document.createElement("p");
      eventVenue.textContent = event.venueName;
      eventVenue.style.margin = "5px 0";
      eventVenue.style.fontSize = "14px";
      eventVenue.style.fontWeight = "bold";
      eventVenue.style.color = "#ccc";
      eventDetails.appendChild(eventVenue);

      // Location
      const eventLocation = document.createElement("p");
      eventLocation.textContent = event.venueLocation;
      eventLocation.style.margin = "5px 0 15px 0";
      eventLocation.style.fontSize = "14px";
      eventLocation.style.color = "#999";
      eventDetails.appendChild(eventLocation);

      // View details button
      const viewButton = document.createElement("a");
      const detailUrl = config.eventDetailUrlPattern.replace('{slug}', event.slug);
      viewButton.href = detailUrl;
      viewButton.textContent = isPast ? config.buttons.viewHistory : config.buttons.viewDetails;
      viewButton.style.display = "inline-block";
      viewButton.style.padding = "8px 16px";
      const buttonBgColor = isPast ? "#555" : (event.color || "#007bff");
      viewButton.style.backgroundColor = buttonBgColor;
      viewButton.style.color = this.getContrastColor(buttonBgColor);
      viewButton.style.textDecoration = "none";
      viewButton.style.borderRadius = "4px";
      viewButton.style.fontWeight = "bold";
      viewButton.style.marginTop = "10px";
      viewButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
      eventDetails.appendChild(viewButton);

      eventCard.appendChild(eventDetails);
      return eventCard;
    },

    getContrastColor: function(hexColor) {
      let color = hexColor.replace('#', '');
      if (color.length === 3) {
        color = color.split('').map(c => c + c).join('');
      }
      const r = parseInt(color.substr(0, 2), 16);
      const g = parseInt(color.substr(2, 2), 16);
      const b = parseInt(color.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.8 ? '#000' : '#fff';
    },

    fetchEvents: function(config, upcomingContainer, pastContainer) {
      fetch(config.apiEndpoint)
        .then(response => response.json())
        .then(data => {
          if (data.success && data.data) {
            const now = new Date();
            let upcomingEvents = [];
            let pastEvents = [];

            if (data.data.upcomingEvents) {
              upcomingEvents = data.data.upcomingEvents.filter(event =>
                new Date(event.endDateTime) >= now
              );
            }

            if (config.enablePastEvents) {
              if (data.data.pastEvents) {
                pastEvents = data.data.pastEvents;
              } else if (data.data.upcomingEvents) {
                pastEvents = data.data.upcomingEvents.filter(event =>
                  new Date(event.endDateTime) < now
                );
              }
            }

            upcomingEvents.sort((a, b) =>
              new Date(a.startDateTime) - new Date(b.startDateTime)
            );

            pastEvents.sort((a, b) =>
              new Date(b.startDateTime) - new Date(a.startDateTime)
            );

            this.displayEvents(upcomingEvents, upcomingContainer, false, config);
            if (config.enablePastEvents && pastContainer) {
              this.displayEvents(pastEvents, pastContainer, true, config);
            }
          } else {
            this.displayNoEvents(upcomingContainer, config.headings.noEvents);
          }
        })
        .catch(error => {
          console.error('FliteEvents: Error fetching events:', error);
          this.displayError(upcomingContainer, config.headings.error);
        });
    },

    displayEvents: function(events, container, isPast, config) {
      if (events.length > 0) {
        events.forEach(event => {
          const eventCard = this.createEventCard(event, isPast, config);
          container.appendChild(eventCard);
        });
      } else {
        const message = isPast ? config.headings.noPast : config.headings.noUpcoming;
        this.displayMessage(container, message, "#ccc");
      }
    },

    displayMessage: function(container, message, color) {
      const messageEl = document.createElement("p");
      messageEl.textContent = message;
      messageEl.style.textAlign = "center";
      messageEl.style.gridColumn = "1 / -1";
      messageEl.style.padding = "40px";
      messageEl.style.fontSize = "18px";
      messageEl.style.color = color;
      container.appendChild(messageEl);
    },

    displayNoEvents: function(container, message) {
      this.displayMessage(container, message, "#ccc");
    },

    displayError: function(container, message) {
      this.displayMessage(container, message, "#ff5555");
    },

    createToggleButton: function(config, pastContainer) {
      const toggleButton = document.createElement("button");
      toggleButton.textContent = config.buttons.showPast;
      toggleButton.style.display = "block";
      toggleButton.style.margin = "20px auto";
      toggleButton.style.padding = "10px 20px";
      toggleButton.style.backgroundColor = "#333";
      toggleButton.style.color = "#fff";
      toggleButton.style.border = "1px solid #444";
      toggleButton.style.borderRadius = "4px";
      toggleButton.style.cursor = "pointer";
      toggleButton.style.fontSize = "16px";
      toggleButton.style.transition = "background-color 0.3s ease";

      toggleButton.addEventListener("mouseover", function () {
        this.style.backgroundColor = "#444";
      });

      toggleButton.addEventListener("mouseout", function () {
        this.style.backgroundColor = "#333";
      });

      toggleButton.addEventListener("click", function () {
        if (pastContainer.style.display === "none") {
          pastContainer.style.display = "grid";
          this.textContent = config.buttons.hidePast;
          pastContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
          pastContainer.style.display = "none";
          this.textContent = config.buttons.showPast;
        }
      });

      return toggleButton;
    },

    setupResponsiveGrid: function(config, upcomingContainer, pastContainer) {
      const adjustGrid = () => {
        const width = window.innerWidth;
        let columns;

        if (width < 768) {
          columns = config.cardsPerRow.mobile;
        } else if (width < 1024) {
          columns = config.cardsPerRow.tablet;
        } else {
          columns = config.cardsPerRow.desktop;
        }

        const columnValue = `repeat(auto-fill, minmax(calc(100% / ${columns} - 20px), 1fr))`;
        upcomingContainer.style.gridTemplateColumns = columnValue;
        if (pastContainer) {
          pastContainer.style.gridTemplateColumns = columnValue;
        }
      };

      adjustGrid();
      window.addEventListener('resize', adjustGrid);
    },

    addStyles: function() {
      const style = document.createElement('style');
      style.id = 'flite-events-styles';
      style.textContent = `
        .flite-events-container {
          background-color: #000;
          color: #fff;
          padding: 20px 0;
        }

        .events-grid {
          margin: 0 auto;
          max-width: 1200px;
        }

        .event-card {
          background-color: #222;
          border: 1px solid #333;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        .event-card:hover {
          transform: translateY(-2px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 8px 20px rgba(0,0,0,0.7), 0 0 15px rgba(255,255,255,0.1);
          border: 1px solid #444;
        }

        .past-event:hover {
          transform: translateY(-3px);
        }

        @media (max-width: 1024px) {
          .events-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .events-grid {
            grid-template-columns: 1fr;
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})();