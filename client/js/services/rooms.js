/**
 * Created by Alex on 26/04/2015.
 */
'use strict';

angular.module('pager-chat').service('RoomsService', [
	function () {
		this.rooms = {};

		this.getRooms = function () {
			return this.rooms;
		};

		this.existRoom = function (room) {
			if (this.rooms[room]) {
				return true;
			}
			return false;
		};
		this.addRoom = function (room) {
			if(this.existRoom(room)){
				return;
			}
			var r = {
				title: '#' + room,
				link: '/room/' + room,
				room: room,
				messages: []
			};
			this.rooms[room] = r;

			return r.link;
		};
		this.removeRoom = function (room) {
			if(!this.existRoom(room)){
				return;
			}
			delete this.rooms[room];
		};

		this.getRoomMessages = function (room) {
			if(!this.existRoom(room)){
				return;
			}
			return this.rooms[room].messages;
		};
		this.addRoomMessage = function (room, message) {
			if(!this.existRoom(room)){
				return;
			}
			this.rooms[room].messages.push(message);
		}
	}
]);
