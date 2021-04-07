define([
    'knockout',
    'views/components/workflows/final-step',
    'viewmodels/alert'
], function(ko, FinalStep, AlertViewModel) {

    function viewModel(params) {
        var self = this;
        FinalStep.apply(this, [params]);
        this.resourceData = ko.observable();
        this.attendees = ko.observableArray();
        this.photographs = ko.observableArray();

        this.resourceData.subscribe(function(val){
            var currentSiteVisit;
            if (Array.isArray(val.resource['Site Visits'])){
                /*val.resource['Site Visits'].forEach(function(visit) {
                    if (visit['Communication Type']['@tile_id'] === params.workflow.getStepData("related-consultation")['tileid']){
                        currentSiteVisit = visit;
                    }
                });*/
                currentSiteVisit = val.resource['Site Visits'][val.resource['Site Visits'].length-1];
            } else {
                currentSiteVisit = val.resource['Site Visits'];
            }
            this.reportVals = {
                consultationName: {'name': 'Consultation', 'value': val.resource['Consultation Names']['Consultation Name']['@value'] || 'none'},
                date: {'name': 'Date', 'value': currentSiteVisit['Timespan of Visit']['Date of Visit']['@value'] || 'none'},
                locatinDescription: {'name': 'Visit Location Description', 'value': currentSiteVisit['Location']['Location Descriptions']['Location Description']['@value'] || 'none'},
                observation: {'name': 'Observations', 'value': currentSiteVisit['Observations']['Observation']['Observation Notes']['@value'] || 'none'},
                recommendations: {'name': 'Recommendations', 'value': currentSiteVisit['Recommendations']['Recommendation']['Recommendation Value']['@value'] || 'none'},
            }

            if (Array.isArray(currentSiteVisit['Attendees'])) {
                currentSiteVisit['Attendees'].forEach(function(attendee){
                    self.attendees.push({
                        attendee: {'name': 'Attendee', 'value': attendee['Attendee']['@value'] || 'none'},
                        attendeeType: {'name': 'Type', 'value': attendee['Attendee Type']['@value'] || 'none'},
                    });
                })
            } else {
                self.attendees = [{
                    attendee: {'name': 'Attendee', 'value': attendee['Attendee']['@value'] || 'none'},
                    attendeeType: {'name': 'Type', 'value': attendee['Attendee Type']['@value'] || 'none'},    
                }]
            };
            if (Array.isArray(currentSiteVisit['Photographs'])){
                currentSiteVisit['Photographs'].forEach(function(photograph){
                    self.photographs.push({
                        photo: {'name': 'Photo', 'value': photograph['@value'] || 'none'},
                        caption: {'name': 'Caption', 'value': photograph['Caption Notes']['Caption Note']['@value'] || 'none'},
                        copyrightType: {'name': 'Copyright Type', 'value': photograph['Copyright']['Copyright Type']['@value'] || 'none'},
                        copyrightHolder: {'name': 'Copyright Holder', 'value': photograph['Copyright']['Copyright Holder']['@value'] || 'none'},
                        copyrightNotes: {'name': 'Copyright Notes', 'value': photograph['Copyright']['Copyright Note']['Copyright Note Text']['@value'] || 'none'},
                    });
                })
            } else {
                self.photographs = [{
                    photo: {'name': 'photo', 'value': currentSiteVisit['Photographs']['@value'] || 'none'},
                    caption: {'name': 'Caption', 'value': currentSiteVisit['Photographs']['Caption Notes']['Caption Note']['@value'] || 'none'},
                    copyrightType: {'name': 'Copyright Type', 'value': currentSiteVisit['Photographs']['Copyright']['Copyright Type']['@value'] || 'none'},
                    copyrightHolder: {'name': 'Copyright Holder', 'value': currentSiteVisit['Photographs']['Copyright']['Copyright Holder']['@value'] || 'none'},
                    copyrightNotes: {'name': 'Copyright Notes', 'value': currentSiteVisit['Photographs']['Copyright']['Copyright Note']['Copyright Note Text']['@value'] || 'none'},
                }]
            };
    
            this.loading(false);
        }, this);

        window.fetch(this.urls.api_resources(this.resourceid) + '?format=json&compact=false')
        .then(response => response.json())
        .then(data => this.resourceData(data))
        
    }

    ko.components.register('site-visit-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/site-visit/site-visit-final-step.htm' }
    });
    return viewModel;
});
