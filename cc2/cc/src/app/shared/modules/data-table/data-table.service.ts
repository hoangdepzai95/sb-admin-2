import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DataTableSelectedRowsModel } from '@shared/models/data-table-selected-rows.model';
import { HttpParams } from '@angular/common/http';
import { AppFilterService } from '@shared/modules/filters/filter.service';
import { SortStateModel } from '@shared/models/sort-state.model';
import { ASC, DESC } from '@src/app/app.constant';
import { DataTableModel } from '@shared/models/data-table.model';
import { ErrorNotifyService } from '@shared/services/error-notify.service';
import { SelectedRowsTextsModel } from '@shared/models/selected-rows-texts.model';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from '@src/app/app.utils';
import { Subscription } from 'rxjs/Subscription';
import { DataTableColumnsWidthModel } from '@shared/models/data-table-columns-width.model';
import { BreadcrumbService } from '@src/app/modules/layout/breadcrumb/breadcrumb.service';

@AutoUnsubscribe()

@Injectable()

export class DataTableService {

    private name: string;

    private totalItems = new BehaviorSubject(-1);

    private pageLimit = new BehaviorSubject(25);

    private selectedRows = new BehaviorSubject<DataTableSelectedRowsModel>([]);

    private currentPage = new BehaviorSubject(1);

    private isSelectedTotalItems = new BehaviorSubject(false);

    private isSelectedAllRows = new BehaviorSubject(false);

    private defaultSortKey: string;

    private sortState: BehaviorSubject<SortStateModel> = new BehaviorSubject({sortKey: '', sortOrder: DESC});

    private  dataTable = new BehaviorSubject<DataTableModel>({
        canEdit: false,
        isAutoBiddingAllowed: false,
        items: [],
        total: -1
    });

    private getRowsDataFunc: Function;

    private loading = new BehaviorSubject<boolean>(false);

    private selectedRowsTexts = new  BehaviorSubject<SelectedRowsTextsModel>({ selectedRows: '', selectedRowsOnPage: '', filtered: '' });

    private campaignId = new BehaviorSubject<number>(0);

    private inCampaignContext = new BehaviorSubject<boolean>(false);

    private adsGroupId = new BehaviorSubject<number>(0);

    private inAdsGroupContext = new BehaviorSubject<boolean>(false);

    private route: ActivatedRoute;

    private routerSub: Subscription;

    private tableColumnsWidth: BehaviorSubject<DataTableColumnsWidthModel> = new BehaviorSubject([]);

    constructor(
        private appFilterService: AppFilterService,
        private errorService: ErrorNotifyService,
        private breadcrumbsService: BreadcrumbService
    ) {
        this.selectedRows.subscribe((selectedRows) => {
            const isSelectedAllRows = selectedRows.length && selectedRows.length === this.dataTable.getValue().items.length;
            this.isSelectedAllRows.next(isSelectedAllRows);
            if (!isSelectedAllRows) {
                this.deselectTotalItems();
            }
        });
    }

    init(
        name: string,
        defaultSortKey: string,
        getRowsDataFunc: Function,
        selectedRowsTexts: SelectedRowsTextsModel,
        route: ActivatedRoute
    ) {
        this.name = name;
        this.getRowsDataFunc = getRowsDataFunc;
        this.defaultSortKey = defaultSortKey;
        this.pageLimit.next(+localStorage.getItem(`${name}_limit`) || 25);
        this.totalItems.next(-1);
        this.selectedRows.next([]);
        this.currentPage.next(1);
        this.isSelectedTotalItems.next(false);
        this.selectedRowsTexts.next(selectedRowsTexts);

        this.routerSub = route.queryParams.subscribe((params) => {
            const campaignId = params['campaignId'];
            const adsGroupId = params['adsGroupId'];

            this.inCampaignContext.next(typeof campaignId !== 'undefined');
            this.inAdsGroupContext.next(typeof adsGroupId !== 'undefined');
            this.campaignId.next(campaignId);
            this.adsGroupId.next(adsGroupId);
        });

        this.route = route;

        this.updateSortState();
    }

    getTableColumnsWidth(): Observable<DataTableColumnsWidthModel> {
        return this.tableColumnsWidth.asObservable();
    }

    setTableColmnsWidth(value: DataTableColumnsWidthModel) {
        this.tableColumnsWidth.next(value);
    }

    getCurrentPage(): Observable<number> {
        return this.currentPage.asObservable();
    }

    getIsSelectedAllRows(): Observable<boolean> {
        return this.isSelectedAllRows.asObservable();
    }

    getSelectedRowsTexts(): Observable<SelectedRowsTextsModel> {
        return this.selectedRowsTexts.asObservable();
    }

    getCampaignIdValue(): number {
        return this.campaignId.getValue();
    }

    getInCampaignContext(): Observable<boolean> {
        return this.inCampaignContext.asObservable();
    }

    getInAdsGroupContext(): Observable<boolean> {
        return this.inAdsGroupContext.asObservable();
    }

    getInAdsGroupContextValue(): boolean {
        return this.inAdsGroupContext.getValue();
    }

    getAdsGroupIdValue(): number {
        return this.adsGroupId.getValue();
    }

    getInCampaignContextValue(): boolean {
        return this.inCampaignContext.getValue();
    }

    get pageLimitOptions() {
        return [
            {
                label: 10,
                value: 10,
                noTranslate: true
            },
            {
                label: 25,
                value: 25,
                noTranslate: true
            },
            {
                label: 50,
                value: 50,
                noTranslate: true
            },
            {
                label: 100,
                value: 100,
                noTranslate: true
            }
        ];
    }

    getPageLimit(): Observable<number> {
        return this.pageLimit.asObservable();
    }

    getCurrentPageValue(): number {
        return this.currentPage.getValue();
    }

    getSelectedRows(): Observable<DataTableSelectedRowsModel> {
        return this.selectedRows.asObservable();
    }

    getTotalItems(): Observable<number> {
        return this.totalItems.asObservable();
    }

    toggleSelectRow(rowId: number) {
        let currentSelected = this.selectedRows.getValue();

        if (currentSelected.find(value => value === rowId)) {
            currentSelected = currentSelected.filter(value => value !== rowId);
        } else {
            currentSelected = [...currentSelected, rowId];
        }

        this.selectedRows.next(currentSelected);
    }

    unSelectAllRows() {
        this.selectedRows.next([]);
    }
    setCurrentPage(page: number) {
        this.currentPage.next(page);
    }

    setPageLimit(limit: number) {
        localStorage.setItem(`${this.name}_limit`, String(limit));
        this.pageLimit.next(limit);
    }

    getIsSelectedTotalItems(): Observable<boolean> {
        return this.isSelectedTotalItems.asObservable();
    }

    getIsSelectedTotalItemValue(): boolean {
        return this.isSelectedTotalItems.getValue();
    }

    selectTotalItems() {
        this.isSelectedTotalItems.next(true);
    }

    deselectTotalItems() {
        this.isSelectedTotalItems.next(false);
    }

    isSelectedRow(id: number, selectedRows: DataTableSelectedRowsModel) {
        return selectedRows.includes(id);
    }

    toggleSelectAllRows(isSelectedAllRows: boolean) {
        if (isSelectedAllRows) {
            this.unSelectAllRows();
        } else {
            this.selectedRows.next(this.dataTable.getValue().items.map(item => item.id));
        }
    }

    private getSavedSortState(): SortStateModel {
        return {
            sortKey: localStorage.getItem(`${this.name}_sort_key`),
            sortOrder: (+localStorage.getItem(`${this.name}_sort_order`)) || DESC,
        };
    }

    updateSortState() {
        this.sortState.next(this.getSavedSortState());
    }

    setSortState(sortKey: string) {
        if (sortKey !== this.sortState.getValue().sortKey) {
            localStorage.setItem(`${this.name}_sort_order`, this.getDefaultSortOrder()[sortKey] || ASC);
        } else {
            localStorage.setItem(`${this.name}_sort_order`, String(this.sortState.getValue().sortOrder === ASC ? DESC : ASC));
        }

        localStorage.setItem(`${this.name}_sort_key`, sortKey);

        this.updateSortState();
    }

    getSortState(): Observable<SortStateModel> {
        return this.sortState.asObservable();
    }

    getSortParam(): string {
        const sortState = this.sortState.getValue();
        let sortKey = sortState.sortKey;
        const sortOrder = sortState.sortOrder;
        if (sortKey) {
            if (sortOrder === DESC) {
                if (sortKey.indexOf('averageCost') !== -1) {
                    sortKey = sortKey.split(',').join(',-');
                } else {
                    sortKey = `-${sortKey}`;
                }
            }
        } else {
            sortKey = this.defaultSortKey;
        }

        return sortKey;
    }

    onError = () => {
        this.loading.next(false);
        this.errorService.show();
    }

    getRowsData() {
        let params = this.getRequestParams();
        const inCampaignContext = this.inCampaignContext.getValue();
        const inAdsGroupContext = this.inAdsGroupContext.getValue();

        if (inCampaignContext) {
            params = params.set('campaign_id', String(this.getCampaignIdValue()));
        }

        if (inAdsGroupContext) {
            params = params.set('ads_group_id', String(this.getAdsGroupIdValue()));
        }
        setTimeout(() => {
            this.loading.next(true);
            this.getRowsDataFunc(params)
                .then((res: DataTableModel) => {
                    this.dataTable.next(res);
                    this.totalItems.next(res.total);
                    this.loading.next(false);
                    this.unSelectAllRows();
                    this.deselectTotalItems();
                    this.updateBreadcrumbs();
                })
                .catch(this.onError);
        });
    }

    updateBreadcrumbs() {
        if (this.getInCampaignContextValue()) {
            this.breadcrumbsService.pushBreadcrumbs({
                id: 'in_campaign_context',
                path: 'campaign #1',
                queryParams: { campaignId: this.getCampaignIdValue() },
                fullPath: window.location.pathname,
                translate: false
            });
        } else {
            this.breadcrumbsService.removeBreadcrumbs(['in_campaign_context']);
        }

        if (this.getInAdsGroupContextValue()) {
            this.breadcrumbsService.pushBreadcrumbs({
                id: 'in_adsGroup_context',
                path: 'ad group #1',
                queryParams: { campaignId: this.getCampaignIdValue(), adsGroupId: this.getAdsGroupIdValue() },
                fullPath: window.location.pathname,
                translate: false
            });
        } else {
            this.breadcrumbsService.removeBreadcrumbs(['in_adsGroup_context']);
        }
    }

    getObservableDataTable(): Observable<DataTableModel> {
        return this.dataTable.asObservable();
    }

    getLoading(): Observable<boolean> {
        return this.loading.asObservable();
    }

    getRequestParams(): HttpParams {

        const filters = this.appFilterService.getFiltersHttpParams();
        const limit = this.pageLimit.getValue();
        const offset = (this.getCurrentPageValue() - 1) * limit;
        const sort = this.getSortParam();

        const params = new HttpParams()
            .set('filter', JSON.stringify(filters))
            .set('limit', String(limit))
            .set('offset', String(offset))
            .set('sort', sort);
        return params;
    }

    updateDataTable(updateFunc: Function) {
        this.dataTable.next(updateFunc(this.dataTable.getValue()));
    }

    getDefaultSortOrder() {
        return {
            'state.status': ASC,
            'details.name': ASC,
            'details.weeklyBudget': DESC,
            'details.type': ASC,
            'advertCount': DESC,
            'clicks': DESC,
            'shows': DESC,
            'ctr': DESC,
            'details.paymentType,averageCost,averageCPC': DESC,
            '-details.paymentType,averageCost,averageCPM': DESC,
            'spending': DESC,
            'timeStart': DESC,
            'details.user_status': ASC,
            'ads_group_name': ASC,
            'campaign_name': ASC,
            'details.title': ASC,
            'type': ASC,
            'details.value': ASC,
        };
    }

}
