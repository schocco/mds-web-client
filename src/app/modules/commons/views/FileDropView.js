var Marionette = require('backbone.marionette');
var tpl = require('../templates/filedrop.hbs');
var $ = require('jquery');
var Uploader = require('html5-uploader');
var _ = require('lodash');

/**
 * Upload view which is basically a wrapper around the html5-uploader package.
 * Displays an upload field and a progress bar if supported by the browser and triggers events on the view so that
 * parent views can react on them.
 * The triggered events are the same as described in the html5-uploader docs.
 *
 * When multi-file uploads are allowed, the view will render a list of selected files and display preview images for image files.
 */
module.exports = Marionette.ItemView.extend({

    template: tpl,
    ui: {
        "dropzone": "#dropzone",
        "preview": "#preview",
        "fileList": "#fileList",
        "progress": "#progress"
    },

    templateHelpers: function() {
        return {
            single: this.single,
            width: this.width
        };
    },

    triggers: {
        "click #uploadBtn": "upload:clicked",
        "click #clearBtn": "clear:clicked"
    },

    defaults: {
        single: false,
        width: 80
    },

    /**
     *
     * @param options upload and view options
     * @param options.url the url where the file should be posted to
     * @param options.name name of the file in the post request
     * @param options.fileFilter function for filtering files (not yet implemented)
     * @param options.single set this to true to allow only a single file to be uploaded at once (default is false)
     * @param options.width width of the upload area in %, default is 80 (allowed are 60,80,100)
     */
    initialize: function (options) {
        this.mergeOptions(options, ['url', 'name', 'fileFilter', 'single', 'width']);
        this.uploaderOptions = {
            el: '.dropzone',
            url: this.url
        };
        _.merge(this.uploaderOptions, {name: this.name});
    },

    onShow: function() {
        this.uploader =  new Uploader(this.uploaderOptions);
        this.uploader.on('files:added', _.bind(function(files){
            this.triggerMethod("files:added", files);
        }, this));
        this.uploader.on('file:preview', _.bind(function(file, $img){
            this.triggerMethod("file:preview", file, $img);
        }, this));
        this.uploader.on('files:cleared', _.bind(function(){
            this.triggerMethod("files:cleared");
        }, this));
        this.uploader.on('upload:progress', _.bind(function(progress){
            this.triggerMethod("upload:progress", progress);
        }, this));
        this.uploader.on('upload:done', _.bind(function(response){
            this.triggerMethod("upload:done", response);
        }, this));
        this.uploader.on('error', _.bind(function(e){
            this.triggerMethod("error", e);
        }, this));
        this.uploader.on('dragover', _.bind(function(f){
            this.triggerMethod("dragover", f);
        }, this));
        this.uploader.on('dragleave', _.bind(function(f){
            this.triggerMethod("dragleave", f);
        }, this));
    },

    onFilesAdded: function(files) {
        if(this.single) {
            //immediately start uploading first files, ignore others
            this.uploader.files = [this.uploader.getFiles()[0]];
            this.uploader.upload();
        }
    },

    onFilePreview: function(file, $img) {
        if ($img) {
            this.ui.preview.append($img);
        } else {
            this.ui.fileList.append("<li>" + file.name + "</li>");
        }

    },

    onFilesCleared: function() {
        this.ui.preview.html("");
        this.ui.fileList.html("");
    },

    onUploadProgress: function(progress) {
        var value = progress + " %";
        console.log(progress);
        this.ui.progress.html(value);
        this.ui.progress.attr("value", parseInt(progress));
    },

    onUploadDone: function(response) {
        this.ui.progress.removeAttr("value");
        this.onClearClicked();
    },

    onError: function(error) {
        if (error.status) console.error(error.status);
        console.error(error.message);
        this.ui.progress.removeAttr("value");
    },

    onDragover: function() {
    },

    onDragleave: function() {
    },

    onUploadClicked: function() {
        this.uploader.upload();
    },
    onClearClicked: function() {
        this.uploader.clearFiles();
    },

    getFiles: function() {
        return this.uploader.getFiles();
    }



});