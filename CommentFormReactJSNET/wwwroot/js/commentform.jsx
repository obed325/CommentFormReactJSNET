class CommentBox extends React.Component {
    //constructor(props) {
    //    super(props);
    //    this.state = { data: [] };
    //    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    //}
    state = { data: this.props.initialData };

    loadCommentsFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        };
        xhr.send();
    }
    handleCommentSubmit = comment => {
        const comments = this.state.data;
        comment.id = comments.length + 1;
        const newComments = comments.concat([comment]);
        this.setState({ data: newComments });

        const data = new FormData();
        data.append('Author', comment.author);
        data.append('Text', comment.text);

        const xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = function () {
            this.loadCommentsFromServer();
        }.bind(this);
        xhr.send(data);
    }
    componentDidMount() {
        this.loadCommentsFromServer();
        window.setInterval(
            () => this.loadCommentsFromServer(),
            this.props.pollInterval,
        );
    }
    render() {
        return (
            <div className="commentBox ml-4">
                <h2>Comments</h2>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
}

class CommentList extends React.Component {
    render() {
        const commentNodes = this.props.data.map(comment => (
            <Comment author={comment.author} key={comment.id}>
                {comment.text}
            </Comment>
        ));
        return <div className="commentList"> {commentNodes}</div>
    }
}

class CommentForm extends React.Component {
    //construcor(props) {
    //    super(props);
    //    this.state = { author: '', text: '' };
    //    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    //    this.handleTextChange = this.handleTextChange.bind(this);
    //    this.handleSubmit = this.handleSubmit.bind(this);
    //}
    state = { author: '', text: '' };

    handleAuthorChange = e => {
        this.setState({ author: e.target.value });
    }
    handleTextChange = e => {
        this.setState({ text: e.target.value });
    }
    handleSubmit = e => {
        e.preventDefault();
        const author = this.state.author.trim();
        const text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({ author: author, text: text });
        this.setState({ author: '', text: '' });
    }
    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <div className="m-0">
                    <input
                        type="text"
                        className="form-control my-2 xs"
                        placeholder="Your name"
                        value={this.state.author}
                        onChange={this.handleAuthorChange}
                    />
                    <textarea
                        type="text"
                        className="form-control my-2"
                        placeholder="Say something.."
                        value={this.state.text}
                        onChange={this.handleTextChange}
                    />
                    <input
                        type="submit"
                        className="btn btn-primary"
                        value="Post" />
                </div>
            </form>
        );
    }
}


function createRemarkable() {
    var remarkable =
        'undefined' != typeof global && global.Remarkable
            ? global.Remarkable
            : window.Remarkable;
    return new remarkable();
}

class Comment extends React.Component {
    rawMarkup = () => {
        const md = createRemarkable();
        const rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    };
    render() {
        return (
            <div className="comment">
                <b className="commentAuthor">{this.props.author}</b>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
}



//ReactDOM.render(
//    <CommentBox
//        url="comments"
//        submitUrl="/comments/new"
//        pollInterval={2000}
//    />,
//    document.getElementById('content'),
//);




