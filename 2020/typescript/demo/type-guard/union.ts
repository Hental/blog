interface HotelItem {
  type: 'hotel';
  data: {
    hotelId: string;
    hotelName: string;
  };
}

interface FlightItem {
  type: 'flight';
  data: {
    departCityCode: string;
    arrivalCityCode: string;
  }
}

type Item = FlightItem | HotelItem;


// test
export function test(item: Item) {
  if (item.type === 'flight') {
    console.log(item.data.arrivalCityCode, item.data.departCityCode);
  }

  if (item.type === 'hotel') {
    console.log(item.data.hotelId, item.data.hotelName);
  }
}
