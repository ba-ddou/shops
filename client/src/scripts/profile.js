import React, { Component } from 'react';
class Profile extends Component {
   constructor(props){
       super(props);
   }
    render() { 
        return ( 
            <div id="profile">
                <div id="profile--avatar"></div>
                <div id="profile--body">
                    <div id="profile--userInfo">
                        <div className="profile--userInfo-info">
                            <span className="profile--userInfo-name">{this.props.data.fullName}</span>
                            <span className="profile--userInfo-email">{this.props.data.email}</span>
                        </div>
                        <div className="profile--userInfo-impressions">
                            <div className="profile--userInfo-liked">
                                <span>Liked</span>
                                <span>{this.props.data.likedShopsCount}</span>
                            </div>
                            <div className="profile--userInfo-disliked">
                                <span>Disliked</span>
                                <span>{this.props.data.dislikedShopsCount}</span>
                            </div>
                        </div>
                    </div>
                    <div id="profile--logoutButton" onClick={this.props.logout}>
                        <span className="profile--logoutButton-icon"></span>
                        <span className="profile--logoutButton-text">Log out</span>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Profile;