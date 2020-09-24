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



// state
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  code: number;
};

type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;

function handleState(state: NetworkState) {
  switch (state.state) { 
    case 'failed':
      console.log(state.code);
      break;
    case 'loading':
      break;
    case 'success':
      console.log(state.response);
      break;
  }
}