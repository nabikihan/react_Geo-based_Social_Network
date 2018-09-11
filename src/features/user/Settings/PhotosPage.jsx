import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import {
    Image,
    Segment,
    Header,
    Divider,
    Grid,
    Button,
    Card,
    Icon
} from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { uploadProfileImage, deletePhoto, setMainPhoto } from '../userActions';


////////////////////////////// 4。 show photos in card group/////////////////////////
// 为了connect fire store，我们query AUTH, 因为我们要使用userI， 这样才能定位photo
// storeAs: store reducer中对应的
const query = ({ auth }) => {
    return [
        {
            collection: 'users',
            doc: auth.uid,
            subcollections: [{ collection: 'photos' }],
            storeAs: 'photos'
        }
    ];
};

const actions = {
    uploadProfileImage,
    deletePhoto,
    setMainPhoto
};


//loading: 就是在upload的时候 有个loading的标志
const mapState = state => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    photos: state.firestore.ordered.photos,
    loading: state.async.loading
});



class PhotosPage extends Component {

/////////////////////////////1。 DROPZONE: 需要files， filename/////////////////////
    // 你可以上传多个图片，所以建立一个array，但是你只能每次拖动一个图片
    state = {
        files: [],
        fileName: '',
        cropResult: null,
        image: {}
    };

    // 我们不允许多个图片的drop，所以index为0
    onDrop = files => {
        this.setState({
            files,
            fileName: files[0].name
        });
    };

////////////////////////////////2。 CROPPER:////////////////////////////////////////
    cropImage = () => {
        if (typeof this.refs.cropper.getCroppedCanvas() === 'undefined') {
            return;
        }

        this.refs.cropper.getCroppedCanvas().toBlob(blob => {
            let imageUrl = URL.createObjectURL(blob);
            this.setState({
                cropResult: imageUrl,
                image: blob
            });
        }, 'image/jpeg');
    };



/////////////////////////////////3。 UPLOAD:///////////////////////////////////
    uploadImage = async () => {
        try {
            await this.props.uploadProfileImage(
                this.state.image,
                this.state.fileName
            );
            this.cancelCrop();
            toastr.success('Success', 'Photo has been uploaded');
        } catch (error) {
            toastr.error('Oops', error.message);
        }
    };

    // cancel upload and reset everything
    cancelCrop = () => {
        this.setState({
            files: [],
            image: {}
        });
    };

/////////////////////////////////5。 DELETE:///////////////////////////////////
    handlePhotoDelete = (photo) => async () => {
        try {
            this.props.deletePhoto(photo);
        } catch (error) {
            toastr.error('Oops', error.message)
        }
    }


/////////////////////////////////6。 MAIN:///////////////////////////////////
    handleSetMainPhoto = (photo) => async () => {
        try {
            this.props.setMainPhoto(photo)
        } catch (error) {
            toastr.error('Oops', error.message)
        }
    }




//////////////////////////////////render/////////////////////////////////////////////
    render() {
        const { photos, profile, loading } = this.props;

        //filter photos就是把不是当前头像的图片放到card group里，这样避免了main photo也别放到card grope里
        let filteredPhotos;
        if (photos) {
            filteredPhotos = photos.filter(photo => {
                return photo.url !== profile.photoURL
            })
        }
        return (
            <Segment>
                <Header dividing size="large" content="Your Photos" />
                <Grid>
                    <Grid.Row />


                    {/*-----------1。 DROPZONE， ADD PHOTO------------------*/}
                    <Grid.Column width={4}>
                        <Header color="teal" sub content="Step 1 - Add Photo" />
                        <Dropzone onDrop={this.onDrop} multiple={false}>
                            <div style={{ paddingTop: '30px', textAlign: 'center' }}>
                                <Icon name="upload" size="huge" />
                                <Header content="Drop image here or click to upload" />
                            </div>
                        </Dropzone>
                    </Grid.Column>

                    {/*-----------2。 CROPPER， RESIZE PHOTO------------------*/}
                    <Grid.Column width={1} />
                    <Grid.Column width={4}>
                        <Header sub color="teal" content="Step 2 - Resize image" />
                        {this.state.files[0] && (
                            <Cropper
                                style={{ height: 200, width: '100%' }}
                                ref="cropper"
                                src={this.state.files[0].preview}
                                aspectRatio={1}
                                viewMode={0}
                                dragMode="move"
                                guides={false}
                                scalable={true}
                                cropBoxMovable={true}
                                cropBoxResizable={true}
                                crop={this.cropImage}
                            />
                        )}
                    </Grid.Column>
                    <Grid.Column width={1} />

                    {/*-----------------------3。 upload PHOTO------------------*/}
                    <Grid.Column width={4}>
                        <Header sub color="teal" content="Step 3 - Preview and Upload" />
                        {this.state.files[0] && (
                            <div>
                                <Image
                                    style={{ minHeight: '200px', minWidth: '200px' }}
                                    src={this.state.cropResult}
                                />
                                <Button.Group>
                                    <Button
                                        loading={loading}
                                        onClick={this.uploadImage}
                                        style={{ width: '100px' }}
                                        positive
                                        icon="check"
                                    />
                                    <Button
                                        disabled={loading}
                                        onClick={this.cancelCrop}
                                        style={{ width: '100px' }}
                                        icon="close"
                                    />
                                </Button.Group>
                            </div>
                        )}
                    </Grid.Column>
                </Grid>


                {/*-----------------------4。 show PHOTO in card group------------------*/}
                {/*-----------------------5。 DELET， TRASH BUTTON------------------*/}
                {/*-----------------------6。 SET MAIN， main BUTTON------------------*/}

                <Divider />
                <Header sub color="teal" content="All Photos" />

                <Card.Group itemsPerRow={5}>
                    <Card>
                        <Image src={profile.photoURL || '/assets/user.png'} />
                        <Button positive>Main Photo</Button>
                    </Card>
                    {photos &&
                    filteredPhotos.map(photo => (
                        <Card key={photo.id}>
                            <Image src={photo.url} />
                            <div className="ui two buttons">
                                <Button onClick={this.handleSetMainPhoto(photo)} basic color="green">
                                    Main
                                </Button>
                                <Button onClick={this.handlePhotoDelete(photo)} basic icon="trash" color="red" />
                            </div>
                        </Card>
                    ))}
                </Card.Group>
            </Segment>
        );
    }
}

// 我们import compose，这样在有很多HOC的时候，可以用逗号隔开，可以让这里的code更加organized一点。
//firestoreConnect： 我们直接与fire store的数据相连。例如在event dashboard中，我们直接query events。
// 这里，我们要query AUTH 的原因是，我们需要从 fire store中得到userID，
export default compose(
    connect(mapState, actions),
    firestoreConnect(auth => query(auth))
)(PhotosPage);