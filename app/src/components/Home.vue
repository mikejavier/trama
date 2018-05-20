<template>
  <div class="wrap">

    <div class="searchbar">
      <b-field expanded>
        <b-select placeholder="Recife antigo" icon="university" expanded>
            <optgroup label="Zona norte">
              <option value="espinheiro">Espinheiro</option>
              <option value="torre">Torre</option>
              <option value="casaamrela">Casa amrela</option>
            </optgroup>
            <optgroup label="Zona sul">
              <option value="boaviagem">Boa viagem</option>
              <option value="setubal">Setubal</option>
              <option value="Pina">Pina</option>
              <option value="Piedade">Piedade</option>
            </optgroup>
        </b-select>
      </b-field>
    </div>

    <div ref="map" class="map"></div>
    <div class="controls control has-text-centered">
      <button class="button is-primary" @click.prevent="goTo">Go</button>
      <button class="button is-primary" @click.prevent="goTosecondStep">Turn Right</button>
      <button class="button is-primary" @click.prevent="playAudioMp3">Play audio</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
var audioMp3;
var map;
var context;
var markers = [];
export default {
  name: 'Home',
  data() {
    return {
      user: {
        lat: null,
        lng: null,
      },
      secondStep: null,
    };
  },
  methods: {
    goTo() {
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      this.calculateAndDisplayRoute(directionsService, directionsDisplay);
    },

    getUserCurrentLocation() {
      navigator.geolocation.getCurrentPosition((location) => {
				this.user.lng = location.coords.longitude;
        this.user.lat = location.coords.latitude;
        this.initMap();
			});
    },

    initMap() {
      var userPin = {
        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        size: new google.maps.Size(20, 32)
      };
      var locations = [
        ['currentUser', this.user.lat, this.user.lng, 4],
        ['Coogee Beach', -8.0585163, -34.87258, 5],
        ['Cronulla Beach', -34.028249, 151.157507, 3],
        ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
        ['Maroubra Beach', -33.950198, 151.259302, 1]
      ];

      map = new google.maps.Map(this.$refs.map, {
        zoom: 15,
        center: { lat: this.user.lat, lng: this.user.lng },
      });

      locations.map((local) => {
        const pinConfig = {
          position:{
            lat: local[1],
            lng: local[2],
          },
          map: map,
        };

        if (local[0] === 'currentUser') {
          pinConfig.icon = userPin;
        }

        var marker = new google.maps.Marker(pinConfig);
        markers.push(marker);
      });
    },

    calculateAndDisplayRoute(directionsService, directionsDisplay) {
      directionsService.route({
        origin: { lat: this.user.lat, lng: this.user.lng },
        destination: { lat: -8.037476, lng: -34.904568 },
        travelMode: 'DRIVING'
      }, (response, status) => {

        markers.map((pin) => {
          if (!pin.icon) return;
          pin.setMap(null);
        });

        if (status === 'OK') {
          directionsDisplay.setDirections(response);
          directionsDisplay.setMap(map);
          const data = response.routes[0].legs[0];
          console.log(data);
          const endAddress = data.end_address
          const firstStep = data.steps[0].instructions.replace(/<(?:.|\n)*?>/gm, '');
          this.secondStep = data.steps[1].instructions.replace(/<(?:.|\n)*?>/gm, '');
          this.getAudio('tudo pronto !')
            .then(() => {
              this.getAudio(firstStep);
            });
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    },

    getAudio(text) {
      return axios.post('http://localhost:3000/audio', { text })
        .then((res) => res.data)
        .then((payload) => {
          const audio = payload.audioContent.data;
          const buffer = new Uint8Array( audio.length );
          buffer.set( new Uint8Array(audio), 0 );
          context.decodeAudioData(buffer.buffer, this.play);
        });
    },

    play(audioBuffer) {
      var source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect( context.destination );
      source.start(0);
    },

    initAudioContext(cb) {
      try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
        cb();
      }
      catch(e) {
        alert('Web Audio API is not supported in this browser');
      }
    },

    goTosecondStep() {
      if (!this.secondStep) return;
      this.getAudio(`em 2 minutos, ${this.secondStep}`);
    },

    playAudioMp3() {
      audioMp3.play();
    },
  },
  created() {
    var mp3midia = require('../../static/audio.mp3');
    audioMp3 = new Audio(mp3midia);
  },
  mounted() {
    this.getUserCurrentLocation();
    this.initAudioContext(() => {
      this.getAudio('Olá, hoje vamos para onde ?');
    });
  },
};
</script>
<style>
.wrap{
  position: relative;
}
.map {
  height: 100vh;
  width: 100%;
}
.searchbar {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  padding-left: 20px;
  padding: 20px;
}
.controls {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding-bottom: 20px;
}
</style>
