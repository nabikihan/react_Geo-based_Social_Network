import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import TextArea from '../../../app/common/form/TextArea';

class EventDetailedChatForm extends Component {

    // reset是 redux form的一个method， 由于我们用了HOC ， 所以这里可以从props中取出。也就是每次都要清空对话框，让client可以写comment
    // 你点了submit comment，则会激发action-ADDeventcomment
    handleCommentSubmit = values => {
        const { addEventComment, reset, eventId, closeForm, parentId } = this.props;
        addEventComment(eventId, values, parentId);
        reset();

        //如果是
        if (parentId !== 0) {
            closeForm();
        }
    };

    render() {
        return (
            <Form onSubmit={this.props.handleSubmit(this.handleCommentSubmit)}>
                <Field name="comment" type="text" component={TextArea} rows={2} />
                <Button content="Add Reply" labelPosition="left" icon="edit" primary />
            </Form>
        );
    }
}

// 这里由于我们只有一个 field，所以我们不用写form，specify filed就可以
export default reduxForm({ Fields: 'comment' })(EventDetailedChatForm);