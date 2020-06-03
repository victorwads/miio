'use strict';

const { SwitchableMode } = require('abstract-things');
const { Humidifier, AdjustableTargetHumidity } = require('abstract-things/climate');

const MiioApi = require('../iotDevice');

const Power = require('./capabilities/power');
const Buzzer = require('./capabilities/buzzer');
const LEDBrightness = require('./capabilities/changeable-led-brightness');
const { Temperature, Humidity } = require('./capabilities/sensor');


/**
 * Abstraction over a Mi Dehumidifier.
 *
 */
module.exports = class extends Humidifier
	.with(
		MiioApi, Power, SwitchableMode,
		AdjustableTargetHumidity, Temperature, Humidity,
		Buzzer, LEDBrightness

	) {
	static get type() {
		return 'miio:dehumidifier';
	}

	constructor(options) {
		super(options);
		const { id } = this.handle.api;

		// Define the power property
		this.defineProperty(
			{ did: `${id}`, siid: 2, piid: 1 },
			{
				name: 'power',
				mapper: v => {
					const { siid, piid } = v;

					if (siid === 2 && piid === 1) {
						return v.value;
					}
				}
			}
		);

		// Set the mode property and supported modes
		this.defineProperty(
			{ did: `${id}`, siid: 2, piid: 3 },
			{
				name: 'mode',
				mapper: v => {
					const { siid, piid } = v;

					if (siid === 2 && piid === 3) {
						return v.value;
					}
				}
			}
		);

		// Sensor value for RelativeHumidity capability
		this.defineProperty(
			{ did: `${id}`, siid: 3, piid: 1 },
			{
				name: 'humidity',
				mapper: v => {
					const { siid, piid } = v;

					if (siid === 3 && piid === 1) {
						return v.value;
					}
				}
			}
		);

		// Sensor value for Temperature capability
		this.defineProperty(
			{ did: `${id}`, siid: 3, piid: 7 },
			{
				name: 'temp',
				mapper: v => {
					const { siid, piid } = v;

					if (siid === 3 && piid === 7) {
						return v.value;
					}
				}
			}
		);

		// State for Indicator Light capability
		this.defineProperty(
			{ did: `${id}`, siid: 5, piid: 1 },
			{
				name: 'led',
				mapper: v => {
					const { siid, piid } = v;

					if (siid === 5 && piid === 1) {
						return v.value;
					}
				}
			}
		);

		// Child Lock
		this.defineProperty(
			{ did: `${id}`, siid: 6, piid: 1 },
			{
				name: 'child_lock',
				mapper: v => {
					const { siid, piid } = v;

					if (siid === 6 && piid === 1) {
						return v.value;
					}
				}
			}
		);

		// // Buzzer and beeping
		this.defineProperty(
			{ did: `${id}`, siid: 4, piid: 1 },
			{
				name: 'buzzer',
				mapper: v => {
					const { siid, piid } = v;

					if (siid === 4 && piid === 1) {
						return v.value;
					}
				}
			}
		);


		// Water Tank Status 
		this.defineProperty(
			{ did: `${id}`, siid: 7, piid: 3 },
			{
				name: 'water_tank',
				mapper: v => {
					const { siid, piid } = v;

					if (siid === 7 && piid === 3) {
						return v.value;
					}
				}
			}
		);
	}

	changePower(value) {
		const { id } = this.handle.api;
		return this.call('set_properties', [
			{ did: `${id}`, siid: 2, piid: 1, value: !!value }
		]);
	}

	/**
	 * Perform a mode change as requested by `mode(string)` or
	 * `setMode(string)`.
	 */
	// 1 (Auto), 2 (Continue), 3 (Dry Clothes)
	changeMode(value) {
		const { id } = this.handle.api;
			
		return this.call('set_properties', [
			{ did: `${id}`, siid: 2, piid: 3, value: value }
		]);
	}
 
	changeIndicatorLight(value) {
		const { id } = this.handle.api;

		return this.call('set_properties', [
			{ did: `${id}`, siid: 5, piid: 1, value: !!value }
		]).then(() => null);
	}

	changeChildLock(value) {
		const { id } = this.handle.api;

		return this.call('set_properties', [
			{ did: `${id}`, siid: 6, piid: 1, value: !!value }
		]).then(() => null);
	}

	changeBuzzer(value) {
		const { id } = this.handle.api;

		return this.call('set_properties', [
			{ did: `${id}`, siid: 4, piid: 1, value: !!value }
		]).then(() => null);
	}


};
