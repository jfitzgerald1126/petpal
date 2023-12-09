import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../common/styles.css';

export default function Moderator() {
    const [reportedComments, setReportedComments] = useState([]);
    const [nextPage, setNextPage] = useState(false);
    const [comments, setComments] = useState([]);

    // use next and prev page to determine whether to show the buttons to navigate to the next and previous pages
    const [page, setPage] = useState(1);
    const bearerToken = localStorage.getItem('access_token');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (reportedComments) {
            for (const comment of reportedComments) {
                fetchComments(comment.comment);
            }
        }
    }, [reportedComments]);

    const fetchComments = async(comment_id) => {
        setComments([]);
        try {
            const res = await axios.get(
                `${BASE_URL}comments/specific_review/${comment_id}/`,
                {
                    headers: { Authorization: `Bearer ${bearerToken}`, }
                }
            );
            if (res.data) {
                setComments([...comments, res.data]);
            }
            // console.log(res);
        } catch(e) {
            console.log(e);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}comments/report/all/?page=${page}`,
                {
                    headers: { Authorization: `Bearer ${bearerToken}`, }
                }
            );
            setReportedComments([...reportedComments, ...res.data.results]);
            console.log("reported comments",reportedComments)
            if(res.data.next) {
                setNextPage(true);
                setPage(page + 1)
            } else {
                setNextPage(false);
            }
            console.log(res);
            console.log(res.data);
            console.log(res.data.next)
        } catch (e) {
            console.log(e);
        }
    };

    const loadMore = async () => {
        if (nextPage) {
            fetchData();
        }
    }

    // const handleScroll = () => {
    //     if (
    //         window.innerHeight + document.documentElement.scrollTop ===
    //         document.documentElement.offsetHeight
    //     ) {
    //         if (nextPage) {
    //             fetchData();
    //         }
    //     }
    // }

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, [nextPage]);

    // format of reportedComments: 
    // [
    //     {
    //         "id": 1,
    //         "reported_user": 3,
    //         "reporter": 8,
    //         "comment": 6,
    //         "reason": "cringe"
    //     },
    //     {
    //         "id": 2,
    //         "reported_user": 3,
    //         "reporter": 8,
    //         "comment": 6,
    //         "reason": "cringe2"
    //     },
    //     {
    //         "id": 3,
    //         "reported_user": 3,
    //         "reporter": 8,
    //         "comment": 6,
    //         "reason": "cringe3"
    //     }
    // ]
    
    const handleDelete = async (id) => {
     
        try{
            const response = await axios({
                method: 'delete',
                url: BASE_URL + 'comments/' + 'report/'+ 'deleted_report/'+ id + '/',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
                
            })
            console.log("deleted comment", id)

        } catch (error) {
            console.log(error)
        }
    }
    const handleDismiss = async (id) => {
     
        try{
            const response = await axios({
                method: 'delete',
                url: BASE_URL + 'comments/'+ 'report/' + 'dissmissed_report/'+  id + '/',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
                
            })
            console.log("deleted comment", id)
        }catch(error){
            console.log("error deleting comment", error)
        }
    }

    return (
     <div className="content-container">
     <div className="reported-comments-container mt-6" style={{marginTop: '200px'}}>
        <h1 className="mb-4">Hello, Admin!</h1>
      <p className="lead mb-4">
        Below is a list of comments that have been flagged for review. Please assess them for any inappropriate content.
      </p>
      <h1 className="mb-4">Reported Comments</h1>
        <div className="list-group">
      {reportedComments.map(reportComment => (
        <div className="reported-comment-item list-group-item list-group-item-action flex-column align-items-start" key={reportComment.id}>
          <div className="d-flex w-100 justify-content-between">
          <p className="reported-comment-title">Reported Comment: {reportComment.comment}</p>
          <p className="reported-comment-title">Content: {
          comments.find((comment) => comment.id === reportComment.comment_id) ? 
          comments.find((comment) => comment.id === reportComment.comment_id).content : ''
            }</p>
          <small className="reported-comment-date">{reportComment.date}</small>
          <p className="reported-comment-reason mb-1">reason for report: {reportComment.reason}</p>
          </div>
          <button className="btn btn-secondary mr-2" onClick={()=> handleDismiss(reportComment.id)}>Dismiss</button>
          <button className="btn btn-danger" onClick={()=> handleDelete(reportComment.id)}>Delete</button>
        </div>
      ))}
      </div>
      <button className="load-more-btn btn btn-success mt-3 mb-3" onClick={loadMore}>Load More</button>
    </div>
    </div> 
    );      
}
