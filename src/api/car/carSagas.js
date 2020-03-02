import { takeEvery, call, put } from 'redux-saga/effects';
import {delay} from "redux-saga";
import { fetchCars, createNewCar } from "./carApi";
import {SUCCESS, FAILURE, UNAUTHORIZED, GET_CARS, CREATE_CAR, CAR_WAS_SUCCESSFULLY_CREATED} from './carActions';
import {ADD_FLASH_MESSAGE, DELETE_BY_VALUE_FLASH_MESSAGES} from "../flash/flashActions";

export function fetchCarsApi (data) {
    return fetchCars(data)
        .then(data => {
            return { response: data }
        })
        .catch(err => {
            return err
        })
}

export function * tryFetchCars (data) {
        const { response, error } = yield call(fetchCarsApi, data);
        if (response.httpStatus === 401) {
            yield put({type: GET_CARS + UNAUTHORIZED, response})
        } else if (response.httpStatus === 200) {
            yield put({ type: GET_CARS + SUCCESS, response })
        } else {
            yield put({ type: GET_CARS + FAILURE, error })
        }

}

export function * carsFetch () {
    yield takeEvery(GET_CARS, tryFetchCars)
}



export function newCarCreateApi (data) {
    return createNewCar(data)
        .then(data => {
            return { response: data }
        })
        .catch(err => {
            return err
        })
}

export function * newCar (data) {
    const { response } = yield call(newCarCreateApi, data);
    if (response.httpStatus === 200) {
        yield put({type: ADD_FLASH_MESSAGE, data: {type: "success", text: CAR_WAS_SUCCESSFULLY_CREATED}});
        yield delay(3000, true);
        yield put({type: DELETE_BY_VALUE_FLASH_MESSAGES, data: CAR_WAS_SUCCESSFULLY_CREATED})
    }

}

export function * newCarCreate () {
    yield takeEvery(CREATE_CAR, newCar)
}