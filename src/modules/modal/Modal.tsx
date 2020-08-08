import React from 'react';
import ReactDOM from 'react-dom';
const modalRoot: HTMLElement = document.getElementById('modal-root') as HTMLElement;

type ModalProps = {
  heading: string,
  onClose: () => void
}
export default class Modal extends React.Component<React.PropsWithChildren<ModalProps>> {
  el: HTMLDivElement;

  constructor(props: React.PropsWithChildren<ModalProps>) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  skeleton() {
    return (
      <>
        <div className="modal-backdrop fade show"></div>
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ overflow: 'auto' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.props.heading}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                  onClick={this.props.onClose.bind(this)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  render() {
    return ReactDOM.createPortal(
      this.skeleton(),
      this.el
    );
  }
}