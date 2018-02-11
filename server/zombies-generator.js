'use strict';

const EventEmitter = require('events');

const Zombie = class Zombie {
    constructor(lat, lon) {
        this.setPosition(lat, lon);
    }

    setPosition(lat, lon) {
        this.lat = lat;
        this.lon = lon;
    }

    toString() {
        return `${this.lon},${this.lat}`;
    }
}

const ZombiesGenerator = class ZombiesGenerator extends EventEmitter {
    constructor() {
        super();

        this.zone = {
            minLon: 48.877531,
            maxLon: 48.872905,
            minLat: 2.343183,
            maxLat: 2.358302
        }

        this.moveRangeAllowed = {
            lon: 0.000030,
            lat: 0.00005
        }

        this.zombies = [];
        this.started = true;
    }

    start() {
        setInterval(() => this.refreshMap(), 200);
    }

    stop() {
        this.started = false;
    }

    newZombie() {
        const lon = this.getRandomCoordiInRange(this.zone.minLon, this.zone.maxLon, 6);
        const lat = this.getRandomCoordiInRange(this.zone.minLat, this.zone.maxLat, 6);
        const zombie = new Zombie(lat, lon);

        this.zombies.push(zombie);

        return zombie;
    }

    getRandomCoordiInRange(from, to, fixed) {
        return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
        // .toFixed() returns string, so ' * 1' is a trick to convert to number
    }

    moveZombies() {
        let zombiesMoved = 0;

        this.zombies = this.zombies.map((zombie) => {
            if(Math.random() >= 0.5) { // Random boolean
                const minLat = zombie.lat - this.moveRangeAllowed.lat;
                const maxLat = zombie.lat + this.moveRangeAllowed.lat;
                const minLon = zombie.lon - this.moveRangeAllowed.lon;
                const maxLon = zombie.lon + this.moveRangeAllowed.lon;

                const lon = this.getRandomCoordiInRange(minLon, maxLon, 6);
                const lat = this.getRandomCoordiInRange(minLat, maxLat, 6);

                zombie.setPosition(lat, lon);

                zombiesMoved++;
            }

            return zombie;
        });

        this.emit('info', `${zombiesMoved} zombie(s) moved of ${this.zombies.length} zombies`);

        return this.zombies;
    }

    getGeoJSON() {
        const geojson = {
            "type": "Feature",
            "geometry": {
                "type": "MultiPoint",
                "coordinates": null
            }
        }

        geojson.geometry.coordinates = this.zombies.map((zombie) => {
            return [zombie.lat, zombie.lon];
        });

        return geojson;
    }

    refreshMap() {
        const randomActionIndex = Math.floor(Math.random() * 4);

        if(randomActionIndex === 0) {
            // Add a new zombie
            const zombie = this.newZombie();

            this.emit('info', `new zombie at ${zombie.toString()}`);
        } else if (randomActionIndex === 1 && this.zombies.length >= 10) {
            // Remove a dead zombie
            const zombiesToRemove = Math.floor(Math.random()*(this.zombies.length/4));
            // this.zombies.length/4 To remove at max 1/4 of the zombies population

            for(let i = 0; i < zombiesToRemove; i++) {
                const zombieIndexToRemove = Math.floor(Math.random()*this.zombies.length);
                this.zombies.splice(zombieIndexToRemove, 1);
            }

            this.emit('info', `${zombiesToRemove} zombie(s) dead`);
        }

        // Move other zombies
        this.moveZombies();

        // Emit scanResfresh event to publish new zombies position
        this.emit('scanResfresh', this.getGeoJSON());

        return this.zombies;
    }
}

module.exports = ZombiesGenerator;
