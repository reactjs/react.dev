import Axios from 'axios';
import OAuth from 'client-oauth2';

// let ebayAuth = new ClientOAuth2({
//   clientId: 'abc',
//   clientSecret: '123',
//   accessTokenUri: 'https://github.com/login/oauth/access_token',
//   authorizationUri: 'https://github.com/login/oauth/authorize',
//   redirectUri: 'http://example.com/auth/github/callback',
//   scopes: ['notifications', 'gist'],
// });

// This obtains the user consent
export const obtainConsent = async () => {
  return await Axios({
    method: 'get',
    url: 'https://auth.ebay.com/oauth2/authorize',
    params: {
      client_id: 'Fred',
      redirect_uri: 'Flintstone',
      response_type: 'code',
    },
  });
};

export const axiosConfig = () => {
  return Axios.create({
    baseURL: 'https://api.ebay.com/',
    headers: {"Authorization": "Basic v^1.1#i^1#r^0#f^0#I^3#p^1#t^H4sIAAAAAAAAAOVXa2wUVRTubh9YkIco1tQa1kEg1OzsnZmd2Z2R3WTb8lhpaenWIiVa787eacfOzixz79Au/dFaIzHEaiQSIz4oQRP8oUDURA2Jj5gAhkiIkKhVjPwgkqAhKYpKDM5Ml7KtBCgsQuL+mZ1zzz33+75zzr1zQX9ZefXG5RvPTvdM8Q71g36vx8NMA+VlpQ/OKPZWlhaBPAfPUP8D/SUDxT8vxjCtZaRmhDOGjpGvJ63pWHKNEcoydcmAWMWSDtMIS0SWErGGeomlgZQxDWLIhkb54nURKgQgryAxLIcBSCmcYlv1CzFbjAjFAYHhWQ5ARkAcH4T2OMYWiuuYQJ1EKBYwoh9wfsC2gJDEAYkP0mKYbaN8rcjEqqHbLjSgoi5cyZ1r5mG9PFSIMTKJHYSKxmNLE42xeN2SlS2LA3mxojkdEgQSC49/qzVSyNcKNQtdfhnseksJS5YRxlQgOrrC+KBS7AKYa4DvSi0ySTbM8IKCQkFBZpiCSLnUMNOQXB6HY1FTfsV1lZBOVJK9kqK2GsknkUxybyvtEPE6n/NYZUFNVVRkRqglNbE1saYmKtoJ5S6C5E7/2J+m5jq/wggpxAtJwR/mIeREWcktNBotJ/OElWoNPaU6omHfSoPUIBs1mqgNm6eN7dSoN5oxhTiI8v3ECxoK4TYnqaNZtEin7uQVpW0hfO7rlTMwNpsQU01aBI1FmDjgShShYCajpqiJg24t5sqnB0eoTkIyUiDQ3d1Nd3O0YXYEWACYwKMN9Qm5E6XtZutJO70+6q9eeYJfdanIyJ6JVYlkMzaWHrtWbQB6BxXlwjwjsjndx8OKTrT+y5DHOTC+IwrVISFOBkJIhoADiiDCcCE6JJor0oCDAyVh1p+GZhciGQ3KyC/bdWalkammJI5XWC6sIH9KEBV/UFQUf5JPCX5GQQgglEzKYvj/1ChXW+oJ2cigJkNT5WxBCr5wxW6mmqBJsgmkabbhaqv+kiSxQ/KG03N6fVIUnRjYDgIzKu3UNi0b6YAB7U3NMbW7qK+LdyyTiafTFoFJDcULs6HdpM3skvRU+7i/pTjZ+RtNpJoaPadpN5s0Xi/TJsKGZdqfKHSjc2y1GF1ItzcBYhqahsxW5roTfYvld5J75bXxLtxBPUnedq+zN7S2ZU21S6j95rC7yVlVIbm1WDM8z/AME+aD18Wr1s1pS/Y/OIsmRW+5gQlK3YDvysD4W260yP0xA54PwIBnj31RBgEwn5kH7i8rfqSk+PZKrBJEq1Chsdqh25c3E9FdKJuBqukt86yt2v12e969eugxcM/Yzbq8mJmWd80GVRdHSpmZFdMZ0f4qZUGIA3ywDcy7OFrC3F1y15H59JaqALXl+Dnce3CPUb/lzd5jYPqYk8dTWlQy4CnKVuu7tj7/Irt/0RkBlE5bevo7brjj1FP7+6aYh745u65VPDZn24IfP1w7EhoJqJXJ296PwS7v6l9f+GvzvkNrF1T8JCbuG6x5t3e7d++nh+9ct6m1b8PmhqnDI1trFgl/LH7o2RVntPXLXvml7/sDzz3x3uxXg0eXh8vjP7xcN9i3oa3y2/IDC1nhDf6lE59VH1/RUMbV7i97a+Hco5/POTLQu81K7/i7XXi4Y+/cZSe/2jGrcXDNOu21KqvyIDn9kTX76VNbK3b/VnnvgPbO1BmbZg1XN573TpkpoLknVjc3Dw8ebns9/nVqzZ87d3xx7vHz2ytGIoln5H3Nd4Avf2dPhnfOXlUdoz45vuvjXPr+ATWeDfDxEAA"}
  });
};  

export const axiosConfigBuyer = () => {
  const buyerOAuth = getBuyerOAuth();
  return Axios.create({
    baseURL: 'https://api.ebay.com/',
    headers: {Authorization: `Basic ${buyerOAuth}`},
  });
};

export const axiosConfigSeller = () => {
  const buyerOAuth = getSellerOAuth();
  return Axios.create({
    baseURL: 'https://api.ebay.com/',
    headers: {Authorization: `Basic ${sellerOAuth}`},
  });
};

const getBuyerOAuth = () => {
  return sessionStorage.getItem('buyerOAuth');
};

const storeBuyerOAuth = oauth => {
  sessionStorage.setItem('buyerOAuth', oauth);
};

const getSellerOAuth = () => {
  return sessionStorage.getItem('sellerOAuth');
};

const storeSellerOAuth = oauth => {
  sessionStorage.setItem('sellerOAuth', oauth);
};

// export const retrieveAndStoreBuyerOAuth = async () => {
//   const api = await axiosConfig();
//   return api.post('/identity/v1/oauth2/token', {
//     grant_type: 'authorization_code',
//   });
// };

// Category ids found here https://www.isoldwhat.com/getcats/index.php?RootID=293#293
export const getAllItemsInCategory = async () => {
    return await Axios.get("http://svcs.ebay.com/services/search/FindingService/v1", {
        params: {
            "OPERATION-NAME": "findItemsAdvanced",
        "SERVICE-VERSION": "1.0.0" ,
        "SECURITY-APPNAME": "YourAppID",
        "RESPONSE-DATA-FORMAT": "JSON",
        "REST-PAYLOAD": true,
        "paginationInput.entriesPerPage": 2,
        "keywords": "electronics"
        }
    }).then(r => r.data)
};

export const 
