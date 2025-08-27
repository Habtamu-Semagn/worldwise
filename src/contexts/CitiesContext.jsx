import { useReducer, useContext } from "react";
import { createContext } from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [
    {
      id: "dcbf",
      cityName: "Bahir Dar",
      country: "Ethiopia",
      emoji: "🇪🇹",
      date: "2025-05-23T00:49:21.151Z",
      notes: "hi",
      position: {
        lat: "11.593239024587367",
        lng: "37.386148703770225",
      },
    },
    {
      id: "007d",
      cityName: "Debre Elias",
      country: "Ethiopia",
      emoji: "🇪🇹",
      date: "2025-05-23T00:49:49.074Z",
      notes: "hulu",
      position: {
        lat: "10.121576169600386",
        lng: "37.22301323486754",
      },
    },

    {
      id: "c3bc",
      cityName: "Macao",
      country: "Portugal",
      emoji: "🇵🇹",
      date: "2025-08-21T08:59:52.147Z",
      notes: "the fourth place",
      position: {
        lat: "39.55620493012127",
        lng: "-8.064422018926678",
      },
    },
    {
      id: "2dba",
      cityName: "Foggaret Ezzaou",
      country: "Algeria",
      emoji: "🇩🇿",
      date: "2025-08-21T09:00:17.942Z",
      notes: "the fifth place",
      position: {
        lat: "27.809627504443046",
        lng: "3.21363380173648",
      },
    },
    {
      id: "d2e6",
      cityName: "Debre Tabor",
      country: "Ethiopia",
      emoji: "🇪🇹",
      date: "2025-08-21T09:03:21.135Z",
      notes: "selam",
      position: {
        lat: "11.853428899917215",
        lng: "38.00670540685919",
      },
    },
  ],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      const newCities = state.cities.filter(
        (city) => city.id !== action.payload
      );
      return {
        ...state,
        isLoading: false,
        cities: newCities,
        currentCity:
          state.currentCity.id === action.payload ? {} : state.currentCity,
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function getCity(id) {
    if (id === currentCity.id) return;
    dispatch({ type: "loading" });
    try {
      const city = cities.find((city) => city.id === id);
      if (!city) throw new Error("City not found");
      dispatch({ type: "cities/loaded", payload: city });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error fetching the city...",
      });
    }
  }

  function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const id = Math.random().toString(36).substr(2, 4); // Simple ID generation
      const cityWithId = { ...newCity, id };
      dispatch({ type: "cities/created", payload: cityWithId });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      if (!cities.some((city) => city.id === id))
        throw new Error("City not found");
      dispatch({ type: "cities/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside of CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };

// import { useReducer } from "react";
// import { useEffect, useContext } from "react";
// import { createContext } from "react";

// const BASE_URL = "http://localhost:9000";

// const CitiesContext = createContext();

// const initialState = {
//   cities: [
//     {
//       id: "dcbf",
//       cityName: "Bahir Dar",
//       country: "Ethiopia",
//       emoji: "🇪🇹",
//       date: "2025-05-23T00:49:21.151Z",
//       notes: "hi",
//       position: {
//         lat: "11.593239024587367",
//         lng: "37.386148703770225",
//       },
//     },
//     {
//       id: "007d",
//       cityName: "Debre Elias",
//       country: "Ethiopia",
//       emoji: "🇪🇹",
//       date: "2025-05-23T00:49:49.074Z",
//       notes: "hulu",
//       position: {
//         lat: "10.121576169600386",
//         lng: "37.22301323486754",
//       },
//     },
//     {
//       id: "cb85",
//       cityName: "Debre Tabor",
//       country: "Ethiopia",
//       emoji: "🇪🇹",
//       date: "2025-08-21T03:18:48.423Z",
//       notes: "helllo",
//       position: {
//         lat: "11.853932723019962",
//         lng: "38.00825071299608",
//       },
//     },
//     {
//       id: "c3bc",
//       cityName: "Macao",
//       country: "Portugal",
//       emoji: "🇵🇹",
//       date: "2025-08-21T08:59:52.147Z",
//       notes: "the fourth place",
//       position: {
//         lat: "39.55620493012127",
//         lng: "-8.064422018926678",
//       },
//     },
//     {
//       id: "2dba",
//       cityName: "Foggaret Ezzaou",
//       country: "Algeria",
//       emoji: "🇩🇿",
//       date: "2025-08-21T09:00:17.942Z",
//       notes: "the fifth place",
//       position: {
//         lat: "27.809627504443046",
//         lng: "3.21363380173648",
//       },
//     },
//     {
//       id: "d2e6",
//       cityName: "Debre Tabor",
//       country: "Ethiopia",
//       emoji: "🇪🇹",
//       date: "2025-08-21T09:03:21.135Z",
//       notes: "selam",
//       position: {
//         lat: "11.853428899917215",
//         lng: "38.00670540685919",
//       },
//     },
//   ],
//   isLoading: false,
//   currentCity: {},
//   error: "",
// };

// function reducer(state, action) {
//   console.log("cities", state.cities);
//   switch (action.type) {
//     case "loading":
//       return { ...state, isLoading: true };
//     case "cities/loaded":
//       return {
//         ...state,
//         isLoading: false,
//         currentCity: action.payload,
//       };
//     case "cities/created":
//       return {
//         ...state,
//         isLoading: false,
//         cities: [...state.cities, action.payload],
//         currentCity: action.payload,
//       };
//     case "cities/deleted":
//       return {
//         ...state,
//         isLoading: false,
//         cities: state.cities.filter((city) => city.id !== action.payload),
//       };
//     case "rejected":
//       return {
//         ...state,
//         isLoading: false,
//         error: action.payload,
//       };
//     default:
//       throw new Error("Unknown action type");
//   }
// }
// function CitiesProvider({ children }) {
//   const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
//     reducer,
//     initialState
//   );

//   useEffect(() => {
//     async function fetchCities() {
//       dispatch({ type: "loading" });
//       try {
//         const res = await fetch(`${BASE_URL}/cities`);
//         const data = await res.json();
//         dispatch({ type: "cities/loaded", payload: data });
//       } catch {
//         dispatch({
//           type: "rejected",
//           payload: "There was an error loading cities",
//         });
//       }
//     }
//     fetchCities();
//   }, []);

//   async function createCity(newCity) {
//     dispatch({ type: "loading" });
//     try {
//       const res = await fetch(`${BASE_URL}/cities`, {
//         method: "POST",
//         body: JSON.stringify(newCity),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await res.json();
//       dispatch({ type: "cities/created", payload: data });
//     } catch {
//       dispatch({
//         type: "rejected",
//         payload: "There was an error loading the city...",
//       });
//     }
//   }

//   async function deleteCity(id) {
//     dispatch({ type: "loading" });
//     try {
//       await fetch(`${BASE_URL}/cities/${id}`, {
//         method: "DELETE",
//       });

//       dispatch({ type: "cities/deleted", payload: id });
//     } catch (error) {
//       dispatch({
//         type: "rejected",
//         payload: "There was an error deleting the city...",
//       });
//     }
//   }

//   async function getCity(id) {
//     if (id === currentCity.id) return;
//     dispatch({ type: "loading" });
//     try {
//       const res = await fetch(`${BASE_URL}/cities/${id}`, { method: "GET" });
//       const data = await res.json();
//       dispatch({ type: "cities/loaded", payload: data });
//     } catch {
//       console.error("Error fetching cities:");
//     }
//   }
//   return (
//     <CitiesContext.Provider
//       value={{
//         cities,
//         isLoading,
//         currentCity,
//         getCity,
//         createCity,
//         deleteCity,
//       }}
//     >
//       {children}
//     </CitiesContext.Provider>
//   );
// }

// function useCities() {
//   const context = useContext(CitiesContext);
//   if (context === undefined)
//     throw new Error("CitiesContext was used outside of CitiesProvider");
//   return context;
// }
// export { CitiesProvider, useCities };
