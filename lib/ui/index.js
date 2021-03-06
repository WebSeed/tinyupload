/* eslint-disable no-console */
import addEmitter from '../utils/addEmitter';
import { on } from '../utils/bindTo';
import { stringIf, pluralIf } from '../utils/string';
import svg from './upload.svg';
export var METHOD_FILE_INPUT = 'filesInput';
export var METHOD_DRAG_AND_DROP = 'dragAndDrop';
export var UI_SUBMIT = 'submit';
export var UI_FILES_CHANGE = 'filesChange';
export var UI_RESET = 'reset';

var create = function create(_ref) {
  var mount = _ref.mount,
      mimeTypes = _ref.mimeTypes,
      hasDnd = _ref.hasDnd,
      _ref$autoSubmit = _ref.autoSubmit,
      autoSubmit = _ref$autoSubmit === void 0 ? true : _ref$autoSubmit,
      _ref$multiple = _ref.multiple,
      multiple = _ref$multiple === void 0 ? true : _ref$multiple;
  var instance = {};
  var emit = addEmitter(instance);
  var WAITING_CLASS = 'tu--is-waiting';
  var UPLOADING_CLASS = 'tu--is-uploading';
  var SUCCESS_CLASS = 'tu--is-success';
  var ERROR_CLASS = 'tu--is-error';
  var HAS_DND_CLASS = 'tu--has-dnd';
  var AUTO_SUBMIT_CLASS = 'tu--auto-submit'; // TODO: data-multiple-caption="{count} files selected"

  var html = "\n    <form\n      class=\"tu " + WAITING_CLASS + " " + stringIf(hasDnd, HAS_DND_CLASS) + " " + stringIf(autoSubmit, AUTO_SUBMIT_CLASS) + "\"\n      method=\"post\"\n      action=\"\"\n      enctype=\"multipart/form-data\"\n    >\n      <div class=\"tu__input\">\n        " + svg + "\n        <input\n          class=\"tu__file\"\n          type=\"file\"\n          name=\"files\"\n          id=\"tu-files-input\"\n          accept=\"" + mimeTypes.join(', ') + "\"\n          " + stringIf(multiple, 'multiple') + "\n        />\n        <label for=\"tu-files-input\">\n          <span class=\"tu__dnd\">Drop " + pluralIf(multiple, 'file') + " here or</span>\n          <strong>browse</strong>\n        </label>\n        <button class=\"tu__button\" type=\"submit\">Upload</button>\n      </div>\n      <div class=\"tu__uploading\">Uploading&hellip;</div>\n      <div class=\"tu__success\">Done! <span></span> <a href=\"javascript:void(0)\">Try again</a></div>\n      <div class=\"tu__error\">Error! <span></span> <a href=\"javascript:void(0)\">Try again</a></div>\n    </form>\n  ";
  var container = document.createElement('div');
  container.innerHTML = html;
  mount.appendChild(container);
  var form = container.querySelector('.tu');
  var filesInput = container.querySelector('#tu-files-input');
  var successMessageSpan = container.querySelector('.tu__success span');
  var successRetryLink = container.querySelector('.tu__success a');
  var errorMessageSpan = container.querySelector('.tu__error > span');
  var errorRetryLink = container.querySelector('.tu__error > a');

  var onFilesChange = function onFilesChange(e, files, method) {
    e.preventDefault();
    emit(UI_FILES_CHANGE, files, method);

    if (autoSubmit) {
      emit(UI_SUBMIT);
    }
  };

  if (!autoSubmit) {
    on(form, 'submit', function (e) {
      e.preventDefault();
      emit(UI_SUBMIT);
      return false;
    });
  }

  on(filesInput, 'change', function (e) {
    return onFilesChange(e, filesInput.files, METHOD_FILE_INPUT);
  });

  if (hasDnd) {
    var swallow = function swallow(e) {
      e.preventDefault();
      e.stopPropagation();
    };

    on(form, 'drag dragstart dragend dragover dragenter dragleave drop', swallow);
    on(form, 'dragover dragenter', function () {
      return form.classList.add('tu--is-dragover');
    });
    on(form, 'dragleave dragend drop', function () {
      return form.classList.remove('tu--is-dragover');
    });
    on(form, 'drop', function (e) {
      return onFilesChange(e, e.dataTransfer.files, METHOD_DRAG_AND_DROP);
    });
  }

  var reset = function reset(e) {
    e.preventDefault();
    emit(UI_RESET);
  };

  on(successRetryLink, 'click', reset);
  on(errorRetryLink, 'click', reset);

  var setFiles = function setFiles()
  /* files */
  {};

  var setWaiting = function setWaiting() {
    form.classList.add(WAITING_CLASS);
    form.classList.remove(SUCCESS_CLASS);
    form.classList.remove(ERROR_CLASS);
  };

  var setUploading = function setUploading() {
    form.classList.remove(WAITING_CLASS);
    form.classList.add(UPLOADING_CLASS);
  };

  var setSuccess = function setSuccess(responses) {
    var count = responses.length;
    successMessageSpan.innerHTML = count + " " + pluralIf(count, 'file') + " uploaded";
    form.classList.remove(UPLOADING_CLASS);
    form.classList.add(SUCCESS_CLASS);
  };

  var setError = function setError(errors) {
    console.log('Errors', errors);
    var count = errors.length;
    errorMessageSpan.innerHTML = count + " " + pluralIf(count, 'error');
    form.classList.remove(UPLOADING_CLASS);
    form.classList.add(ERROR_CLASS);
  };

  Object.assign(instance, {
    setFiles: setFiles,
    setWaiting: setWaiting,
    setUploading: setUploading,
    setSuccess: setSuccess,
    setError: setError
  });
  return instance;
};

export default create;