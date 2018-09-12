import React, { Component } from 'react';
import { Segment, Header, Comment } from 'semantic-ui-react';
import EventDetailedChatForm from './EventDetailedChatForm';
import { Link } from 'react-router-dom';
import distanceInWords from 'date-fns/distance_in_words';

class EventDetailedChat extends Component {
    state = {
        showReplyForm: false,
        selectedCommentId: null
    };

    // reply 有个fORM, 它平时是隐藏的，你不点reply，它不出来，所以这里我们要设个flag
    handleOpenReplyForm = id => () => {
        this.setState({
            showReplyForm: true,
            selectedCommentId: id
        });
    };

    // reply结束之后，关闭reply form
    handleCloseReplyForm = () => {
        this.setState({
            selectedCommentId: null,
            showReplyForm: false
        });
    };

    // selectedCommentId：我们用这个来 check 我们是否需要open A NEW FORM，
    //                   情况1，在有eventchat的时候，你想去reply某个comment，你点了reply这个button，你的当前commentID被设为为selectID，
    //                         则parentID就会被设为当前的commentID，然后你会被导入chatform，去填表
    render() {
        const { addEventComment, eventId, eventChat } = this.props;
        const { showReplyForm, selectedCommentId } = this.state;
        return (
            <div>
                <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
                    <Header>Chat about this event</Header>
                </Segment>

                <Segment attached>
                    <Comment.Group>

                        {/*在 firebase中，event chat下面有很多comment， with comment ID, 这里我们遍历一下。*/}
                        {eventChat &&
                        eventChat.map(comment => (
                            <Comment key={comment.id}>
                                <Comment.Avatar src={comment.photoURL || '/assets/user.png'} />
                                <Comment.Content>
                                    <Comment.Author as={Link} to={`/profile/${comment.uid}`}>
                                        {comment.displayName}
                                    </Comment.Author>
                                    <Comment.Metadata>
                                        <div>{distanceInWords(comment.date, Date.now())} ago</div>
                                    </Comment.Metadata>
                                    <Comment.Text>{comment.text}</Comment.Text>
                                    <Comment.Actions>
                                        <Comment.Action onClick={this.handleOpenReplyForm(comment.id)}>Reply</Comment.Action>
                                        {showReplyForm &&
                                        selectedCommentId === comment.id && (
                                            <EventDetailedChatForm
                                                form={`reply_${comment.id}`}
                                                addEventComment={addEventComment}
                                                eventId={eventId}
                                                closeForm={this.handleCloseReplyForm}
                                                parentId={comment.id}
                                            />
                                        )}
                                    </Comment.Actions>
                                </Comment.Content>


                                {/*用chat tree来organize reply位置*/}
                                {/*？？？这里的comment直接为chat tree？？/*/}
                                {comment.childNodes &&
                                comment.childNodes.map(child => (
                                    <Comment.Group>
                                        <Comment key={child.id}>
                                            <Comment.Avatar src={child.photoURL || '/assets/user.png'} />
                                            <Comment.Content>
                                                <Comment.Author as={Link} to={`/profile/${child.uid}`}>
                                                    {child.displayName}
                                                </Comment.Author>
                                                <Comment.Metadata>
                                                    <div>{distanceInWords(child.date, Date.now())} ago</div>
                                                </Comment.Metadata>
                                                <Comment.Text>{child.text}</Comment.Text>
                                                <Comment.Actions>
                                                    <Comment.Action onClick={this.handleOpenReplyForm(child.id)}>Reply</Comment.Action>
                                                    {showReplyForm &&
                                                    selectedCommentId === child.id && (
                                                        <EventDetailedChatForm

                                                            // FORM ： 确保each form is given its own unique NAME
                                                            form={`reply_${child.id}`}
                                                            addEventComment={addEventComment}
                                                            eventId={eventId}
                                                            closeForm={this.handleCloseReplyForm}
                                                            parentId={child.parentId}
                                                        />
                                                    )}
                                                </Comment.Actions>
                                            </Comment.Content>
                                        </Comment>
                                    </Comment.Group>
                                ))}
                            </Comment>
                        ))}
                    </Comment.Group>

                    {/*comment form是永远存在于对话框的底部的，但是你只有直接点它（意味着parentID 为0），不reply其他的，它才能被触发，转到chatform页面*/}
                    {/*你用redux inspectcheck，你就会发现这个是直接有redux form触发的，它直接把这个触发叫new comment，然后跳转到chatform*/}
                    {/*当你没有eventchat的时候，程序到这里，发起第一个comment*/}
                    <EventDetailedChatForm parentId={0} form={'newComment'} addEventComment={addEventComment} eventId={eventId} />

                </Segment>
            </div>
        );
    }
}

export default EventDetailedChat;