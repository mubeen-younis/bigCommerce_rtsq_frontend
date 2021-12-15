import React, { useState, Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { } from 'antd';

function PlanStatusHeading(){
    const { currentPlan } = useSelector(state => state);
    return  (
        <Fragment>
            {( currentPlan?.status === 3 ) ?
                <div className='note-bx'>
                    Your plan has been expired 
                    
                  </div>
                : 
            ( currentPlan?.plan_id === 0 ) ?
                <div className='note-bx'>
                You have no any active plan 
                </div>
                :
                ( currentPlan?.plan_id === 1 ) ?
                    <div className='note-bx'>
                        You are currently on trial plan,
                        {currentPlan?.status === 1 && (
                        ' it will expire on '+currentPlan?.ends_at
                    )}
                    </div>
                : (currentPlan?.plan_id === 2 ) ?
                    <div className='note-bx'>
                    You are currently on basic plan
                    {currentPlan?.status === 2 ? (
                        ' subscription will be cancelled automatically at the end of the period on '+currentPlan?.ends_at
                    ):(
                        ' it will auto renew on '+currentPlan?.ends_at
                    )}
                    </div>
                : (currentPlan?.plan_id === 3 ) ?
                    <div className='note-bx'>
                    You are currently on standard plan
                    {currentPlan?.status === 2 ? (
                        ' subscription will be cancelled automatically at the end of the period on '+currentPlan?.ends_at
                    ):(
                        ' it will auto renew on '+currentPlan.ends_at
                    )}
                    </div>
                : (currentPlan?.plan_id === 4 ) ?
                    <div className='note-bx'>
                    You are currently on advanced plan
                    {currentPlan?.status === 2 ? (
                        ' subscription will be cancelled automatically at the end of the period on '+currentPlan?.ends_at
                    ):(
                        ' it will auto renew on '+currentPlan?.ends_at
                    )}
                    </div>
                : null
            }   
        </Fragment>
        )
}

export default PlanStatusHeading;