import { put, get, post, del } from './api';

export const addMyPills = async ( name:string, expiredat:string,  onSuccess?:()=>void, onFailure?:(arg0:any)=>void) => {
    try {
        console.log(expiredat);
      const data = await post('/api/mypills', {name:name, expiredat:expiredat} );
      if (onSuccess) onSuccess();  
  
    } catch (error) {
      console.error('Add My Pills failed', error);
      if (onFailure) onFailure(error);
    }
  };

  export const fetchMyPills = async (
    limit: number,
    offset: number,
    sortedBy: string,
    order: string,
    onSuccess?:(arg0:any)=>void, 
    onFailure?:(arg0:any)=>void) => {
    try {
      const data = await get('/api/mypills', {
        limit: limit,
        offset: offset,
        sortedBy: sortedBy,
        order: order
      } );

      if (onSuccess) onSuccess(data);  
  
    } catch (error) {
      console.error('Fetch My Pills failed', error);
      if (onFailure) onFailure(error);
    }
  };

  export const updateMyPills = async (
    mypillid:string,
    name:string, expiredat:string,
    onSuccess?:()=>void, onFailure?:(arg0:any)=>void) => {
    try {
      const data = await put(`/api/mypills/${mypillid}`,  {name:name, expiredat:expiredat} );
      if (onSuccess) onSuccess();  
  
    } catch (error) {
      console.error('Update My Pills failed', error);
      if (onFailure) onFailure(error);
    }
  };

  export const deleteMyPills = async (
    mypillid:string,
    onSuccess?:()=>void, onFailure?:(arg0:any)=>void) => {
    try {
      const data = await del(`/api/mypills/${mypillid}` );
      if (onSuccess) onSuccess();  
  
    } catch (error) {
      console.error('Delete My Pills failed', error);
      if (onFailure) onFailure(error);
    }
  };