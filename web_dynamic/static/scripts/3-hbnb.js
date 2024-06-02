$(document).ready(function () {
  const selectedAmenities = {};

  $('input[type="checkbox"]').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      delete selectedAmenities[amenityId];
    }

    $('#selectedAmenities').text(Object.entries(selectedAmenities).map(([id, name]) => `${name} (${id})`).join(', '));
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json',
    data: '{}',
    success: function (response) {
      populatePlaces(response);
    },
    error: function (error) {
      console.error('Error fetching places:', error);
    }
  });
});

function populatePlaces (placesData) {
  const placesSection = $('.places');

  placesData.forEach(place => {
    const placeArticle = $('<article>');
    placeArticle.append($('<div>').addClass('title_box')
      .append($('<h2>').text(place.name))
      .append($('<div>').text(`$${place.price_by_night}`)));
    placeArticle.append($('<div>').addClass('information')
      .append($('<div>').text(`${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}`))
      .append($('<div>').text(`${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}`))
      .append($('<div>').text(`${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`)));
    placeArticle.append($('<div>').addClass('description')
      .text(place.description));

    placesSection.append(placeArticle);
  });
}
