import * as React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { observable } from "mobx";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import {
  collection,
  injectMainStore,
  MainStoreInjected,
  EntityPermAccessControl
} from "@cuba-platform/react-core";
import { DataTable, Spinner } from "@cuba-platform/react-ui";

import { WeirdStringIdTestEntity } from "../../cuba/entities/scr_WeirdStringIdTestEntity";
import { SerializedEntity, getStringId } from "@cuba-platform/rest";
import { WeirdStringIdMgtTableManagement } from "./WeirdStringIdMgtTableManagement";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

@injectMainStore
@observer
class WeirdStringIdMgtTableBrowseComponent extends React.Component<
  MainStoreInjected & WrappedComponentProps
> {
  dataCollection = collection<WeirdStringIdTestEntity>(
    WeirdStringIdTestEntity.NAME,
    {
      view: "_local",
      sort: "-updateTs",

      stringIdName: "identifier"
    }
  );
  @observable selectedRowKey: string | undefined;

  fields = ["description", "id", "identifier"];

  showDeletionDialog = (e: SerializedEntity<WeirdStringIdTestEntity>) => {
    Modal.confirm({
      title: this.props.intl.formatMessage(
        { id: "management.browser.delete.areYouSure" },
        { instanceName: e._instanceName }
      ),
      okText: this.props.intl.formatMessage({
        id: "management.browser.delete.ok"
      }),
      cancelText: this.props.intl.formatMessage({ id: "common.cancel" }),
      onOk: () => {
        this.selectedRowKey = undefined;
        return this.dataCollection.delete(e);
      }
    });
  };

  render() {
    if (this.props.mainStore?.isEntityDataLoaded() !== true) return <Spinner />;

    const buttons = [
      <EntityPermAccessControl
        entityName={WeirdStringIdTestEntity.NAME}
        operation="create"
        key="create"
      >
        <Link
          to={
            WeirdStringIdMgtTableManagement.PATH +
            "/" +
            WeirdStringIdMgtTableManagement.NEW_SUBPATH
          }
        >
          <Button
            htmlType="button"
            style={{ margin: "0 12px 12px 0" }}
            type="primary"
            icon={<PlusOutlined />}
          >
            <span>
              <FormattedMessage id="common.create" />
            </span>
          </Button>
        </Link>
      </EntityPermAccessControl>,
      <EntityPermAccessControl
        entityName={WeirdStringIdTestEntity.NAME}
        operation="update"
        key="update"
      >
        <Link
          to={WeirdStringIdMgtTableManagement.PATH + "/" + this.selectedRowKey}
        >
          <Button
            htmlType="button"
            style={{ margin: "0 12px 12px 0" }}
            disabled={!this.selectedRowKey}
            type="default"
          >
            <FormattedMessage id="common.edit" />
          </Button>
        </Link>
      </EntityPermAccessControl>,
      <EntityPermAccessControl
        entityName={WeirdStringIdTestEntity.NAME}
        operation="delete"
        key="delete"
      >
        <Button
          htmlType="button"
          style={{ margin: "0 12px 12px 0" }}
          disabled={!this.selectedRowKey}
          onClick={this.deleteSelectedRow}
          type="default"
        >
          <FormattedMessage id="common.remove" />
        </Button>
      </EntityPermAccessControl>
    ];

    return (
      <DataTable
        dataCollection={this.dataCollection}
        fields={this.fields}
        onRowSelectionChange={this.handleRowSelectionChange}
        hideSelectionColumn={true}
        buttons={buttons}
      />
    );
  }

  getRecordById(id: string): SerializedEntity<WeirdStringIdTestEntity> {
    const record:
      | SerializedEntity<WeirdStringIdTestEntity>
      | undefined = this.dataCollection.items.find(
      record => getStringId(record.id!) === id
    );

    if (!record) {
      throw new Error("Cannot find entity with id " + id);
    }

    return record;
  }

  handleRowSelectionChange = (selectedRowKeys: string[]) => {
    this.selectedRowKey = selectedRowKeys[0];
  };

  deleteSelectedRow = () => {
    this.showDeletionDialog(this.getRecordById(this.selectedRowKey!));
  };
}

const WeirdStringIdMgtTableBrowse = injectIntl(
  WeirdStringIdMgtTableBrowseComponent
);

export default WeirdStringIdMgtTableBrowse;
