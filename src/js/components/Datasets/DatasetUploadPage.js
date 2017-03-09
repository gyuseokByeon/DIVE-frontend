import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { Button, Intent } from '@blueprintjs/core';
import { fetchDatasets } from '../../actions/DatasetActions';
import { uploadDataset } from '../../actions/DatasetActions';
import styles from './Datasets.sass';

import Dropzone from 'react-dropzone';
import Loader from '../Base/Loader';
import HeaderBar from '../Base/HeaderBar';

export class DatasetUploadPage extends Component {
  componentWillMount() {
    const { project, datasets, params, fetchDatasets, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasets, datasetSelector, push, params, fetchDatasets } = nextProps;
    if (datasetSelector.id != this.props.datasetSelector.id) {
      push(`/projects/${ params.projectId }/datasets/${ datasetSelector.id }/inspect`);
    }

    if (project.id && !datasets.fetchedAll && !datasets.isFetching) {
      fetchDatasets(params.projectId, false);
    }
  }

  onDrop = (files) => {
    const fileSize = files[0].size;
    const fileSizeLimit = 1000; // 100 * (1000 * 1000);

    this.props.uploadDataset(this.props.project.id, files[0]);
  }

  onOpenClick = () => {
    this.refs.dropzone.open();
  }

  onPreloadedClick = () => {
    const { project, push } = this.props;
    push(`/projects/${ project.id }/datasets/preloaded`);
  }

  render() {
    const { projectTitle, datasetSelector } = this.props;

    return (
      <DocumentTitle title={ 'Upload' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ styles.fillContainer }>
          <div
            className={ styles.datasetUploadBox }>
            { datasetSelector.isUploading &&
              <div className={ styles.uploadingZone + ' ' + styles.centeredFill }>
              { datasetSelector.progress &&
                <Loader text={ datasetSelector.progress } />
              }
              { datasetSelector.error &&
                <Loader text={ datasetSelector.error } error={ true }/>
              }
              </div>
            }
            { !datasetSelector.isUploading &&
              <Dropzone ref="dropzone" className={ styles.dropzone + ' ' + styles.centeredFill } onDrop={ this.onDrop } disableClick={ true }>
                <Button
                  intent={ Intent.PRIMARY }
                  className="pt-large"
                  text="Upload Dataset"
                  onClick={ this.onOpenClick } />
                <div className={ styles.dragAndDrop }>or drag and drop files here</div>
                { !datasetSelector.error &&
                  <div className={ styles.uploadDescription }>
                    <div>Supported file types: CSV, TSV, JSON, EXCEL</div>
                  </div>
                }
                { datasetSelector.error &&
                  <div className={ styles.errorDescription }>
                    <div>{ datasetSelector.error }</div>
                    <div>Please try another file</div>
                  </div>
                }
                <div className={ styles.separater }></div>
                <div className={ styles.preloadedNav }>Or select from <span className={ styles.link } onClick={ this.onPreloadedClick }>preloaded datasets</span></div>
              </Dropzone>
            }
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

DatasetUploadPage.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object
};


function mapStateToProps(state) {
  const { project, datasets, datasetSelector } = state;
  return { project, projectTitle: project.title, datasets, datasetSelector };
}

export default connect(mapStateToProps, {
  uploadDataset,
  fetchDatasets,
  push
})(DatasetUploadPage);
