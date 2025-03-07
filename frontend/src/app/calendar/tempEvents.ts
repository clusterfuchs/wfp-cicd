import { Event } from '../event';

export class EventArray {
    eventsArray: Event[] = [
          {
              '_id': "1091",
              'title': "Feier Eins",
              'start_date': new Date(2024,7,10,15,0),
              'end_date': new Date(2024,7,10,18,0),
              'color': 'event-green'
          },
          {
              '_id': "1092",
              'title': "Feier Zwei",
              'start_date': new Date(2024,7,5,15,0),
              'end_date': new Date(2024,7,8,18,0),
              'color': 'event-yellow'
          },
          {
              '_id': "1093",
              'title': "Feier Drei",
              'start_date': new Date(2024,6,30,15,0),
              'end_date': new Date(2024,6,30,18,0),
              'color': 'event-blue'
          },
          {
              '_id': "1094",
              'title': "Feier Vier",
              'start_date': new Date(2024,7,15,15,0),
              'end_date': new Date(2024,7,16,18,0),
              'color': 'event-green'
          },
          {
              '_id': "1095",
              'title': "Feier Fuenf",
              'start_date': new Date(2024,7,8,15,0),
              'end_date': new Date(2024,7,8,18,0),
              'color': 'event-red'
          },
      ];
}