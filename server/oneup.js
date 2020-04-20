const axios = require('axios');
const _ = require('lodash');
const ONEUP_WEBAPP_CLIENTID =
  process.env.ONEUP_WEBAPP_CLIENTID;
const ONEUP_WEBAPP_CLIENTSECRET =
  process.env.ONEUP_WEBAPP_CLIENTSECRET;
const ROOT_URL = `https://api.1up.health`;
const USER_URL = `${ROOT_URL}/user-management/v1/user`;
let accessTokenCache = {};

/**
 * Returns URL to connect to 1upHealth authenticaion portal
 * ?success=true&iss=https://open-ic.epic.com/FHIR/api/FHIR/DSTU2
 * @param {string} ehrId - The EHR ID (4706 for Epic)
 * @param {string} appUserId - The app user ID
 */
const connectEhrData = (ehrId, appUserId) => {
  const accessToken = accessTokenCache[appUserId].access_token;
  return `${ROOT_URL}/connect/system/clinical/${ehrId}?client_id=${ONEUP_WEBAPP_CLIENTID}&access_token=${accessToken}`;
}

/**
 * Get the 1upHealth user id
 * @param {string} appUserId - The app user ID
 * @return {Object} data - An object with app and oneup id's
 */
const getOneUpUserId = async appUserId => {
  try {
    const response = await axios.get(USER_URL, {
      params: {
        client_id: ONEUP_WEBAPP_CLIENTID,
        client_secret: ONEUP_WEBAPP_CLIENTSECRET,
        app_user_id: appUserId
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.log('Error: ' + error);
  }
}

/**
 * Create a user
 * Stores the app user's access and refresh token data in the cache
 * @param {string} appUserId - The app user ID
 * @return void
 */
const createOneUpUser = async appUserId => {
  try {
    const response = await axios.post(USER_URL, null, {
      params: {
        app_user_id: appUserId,
        client_id: ONEUP_WEBAPP_CLIENTID,
        client_secret: ONEUP_WEBAPP_CLIENTSECRET
      }
    });
    const data = response.data;

    // User already exists, get auth code
    let authCode;
    if (data.success === false) {
      authCode = await getAuthCodeForExistingUser(appUserId);
    } else {
      authCode = data.code;
    }
    const tokenResponse = await getTokenFromAuthCode(authCode);
    accessTokenCache[appUserId] = tokenResponse;
  } catch (error) {
    console.log('Error: ' + error);
  }
}

/**
 * Get access token from an existing user
 * @param {string} code - The authorization code
 * @return {Object} data - Full access token response
 */
const getTokenFromAuthCode = async code => {
  try {
    const response = await axios.post(`${ROOT_URL}/fhir/oauth2/token`, null, {
      params: {
        client_id: ONEUP_WEBAPP_CLIENTID,
        client_secret: ONEUP_WEBAPP_CLIENTSECRET,
        code: code,
        grant_type: 'authorization_code'
      }
    })
    const data = response.data;
    return data;
  } catch (error) {
    console.log('Error: ' + error);
  }
}

/**
 * Get authorization code for an existing user
 * @param {string} appUserId - The app user ID
 * @return {string} code - The authorization code
 */
const getAuthCodeForExistingUser = async appUserId => {
  try {
    const response = await axios.post(`${USER_URL}/auth-code`, null, {
      params: {
        app_user_id: appUserId,
        client_id: ONEUP_WEBAPP_CLIENTID,
        client_secret: ONEUP_WEBAPP_CLIENTSECRET
      }
    });
    const data = response.data;
    return data.code
  } catch (error) {
    console.log('Error: ' + error);
  }
}

/**
 * Get or make 1upHealth User
 * @param {string} appUserId - The app user ID
 * @return {void}
 */
const getOrMakeOneUpUserId = async appUserId => {
  //Test existence of user both in-app and in 1up else create user
  const appUser = await getOneUpUserId(appUserId);
  if (appUser.entry.length === 0 ||
    typeof accessTokenCache[appUserId] == 'undefined'
  ) {
    await createOneUpUser(appUserId);
    return;
  } else {
    //User already exists use cache
    return
  }
}

/**
 * $eveything Query
 * @param {string} accessToken - Access token for 1upHealth
 * @param {string} patientId - Patient ID for 1upHealth
 * @return {Object} resourceObject - {resourceType: [records], resourceType: [records]}
 */
const getFhirEverythingQuery = async (accessToken, patientId) => {
  let all = [];
  let skip = 0;
  let url = `${ROOT_URL}/fhir/dstu2/Patient/${patientId}/$everything`
  try {
    const response = await axios.get(`${url}?_skip=${skip}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const data = response.data;
    all.push(data.entry);

    // If >10 entries, create async requests on remaining links
    const total = data.total;
    const entriesPerRequest = 10;
    let urlArray = [];
    if (total > entriesPerRequest) {
      for (var i = 1; i < Math.ceil(total / entriesPerRequest); i++) {
        skip = i * entriesPerRequest;
        urlArray[i - 1] = `${url}?_skip=${skip}`;
      }
      let promiseArray = urlArray.map(url => axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }));
      let responses = await axios.all(promiseArray);

      // Transform records array to grouping by resourceType
      let temp = responses.map(r => r.data.entry);
      all.push(...temp)
      let resourceTables = all.flat().map(record => record.resource);

      return _.groupBy(resourceTables, b => b.resourceType);
    }
  } catch (error) {
    console.log('Error: ' + error);
  }
}

exports.accessTokenCache = accessTokenCache;
exports.getOrMakeOneUpUserId = getOrMakeOneUpUserId;
exports.connectEhrData = connectEhrData;
exports.getFhirEverythingQuery = getFhirEverythingQuery;
