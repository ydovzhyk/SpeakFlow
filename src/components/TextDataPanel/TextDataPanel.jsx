import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { getOpenBtn } from "../../redux/technical/technical-selectors";
import { getSearchTextData } from "../../redux/textData/textData-operations";
import {
  getTotalSearchPage,
  getSearchDataArray,
} from "../../redux/textData/textDate-selectors";
import {
  setOpenBtn,
  setSentenceTranscript,
  setSentenceTranslated,
} from "../../redux/technical/technical-slice";
import Button from "../Shared/Button";
import Pagination from "../Shared/Pagination/Pagination";
import TextField from "../Shared/TextField";
import { fields } from "../Shared/TextField/fields";
import s from "./TextDataPanel.module.scss";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};

const TextDataPanel = () => {
  const dispatch = useDispatch();
  const isOpenBtn = useSelector(getOpenBtn);
  const [isOpenPanel, setIsOpenPanel] = useState(false);
  const [isUpdatedArray, setIsUpadtedArray] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const totalPages = useSelector(getTotalSearchPage);
  const searchArray = useSelector(getSearchDataArray);

  useEffect(() => {
    if (isOpenBtn) {
      setIsOpenPanel(true);
    } else {
      setIsOpenPanel(false);
    }
  }, [isOpenBtn]);

  useEffect(() => {
    if (isOpenBtn && !isUpdatedArray) {
      dispatch(getSearchTextData({ searchText: "", page: activePage }));
      setIsUpadtedArray(true);
    } else {
      return;
    }
  }, [isOpenBtn, activePage, dispatch, isUpdatedArray]);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const handleClick = (id) => {
    const item = searchArray.find((item) => item._id === id);
    dispatch(
      setSentenceTranscript(item.transcription ? item.transcription : [])
    );
    dispatch(setSentenceTranslated(item.translation ? item.translation : []));
    setIsOpenPanel(false);
    dispatch(setOpenBtn(!isOpenBtn));
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      keyword: "",
    },
  });

  const onSubmit = (data, e) => {
    e.preventDefault();
    dispatch(getSearchTextData({ searchText: data.keyword, page: activePage }));
    reset();
  };

  return (
    <div className={s.textData}>
      <div className={`${s.panel} ${isOpenPanel ? s.open : ""}`}>
        <div className={s.textData__content}>
          <div className={s.textData__contentWrapper}>
            <p className={s.textData__textMain}>
              Search for the entry by keyword:
            </p>
            <form
              className={s.textData__form}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                as={TextField}
                control={control}
                name="keyword"
                render={({ field: { onChange, value } }) => (
                  <input
                    className={s.textData__input}
                    value={value}
                    onChange={onChange}
                    placeholder="keyword or phrase"
                    {...fields.keyword}
                  />
                )}
              />
              <div className={s.textData__wrapBtn}>
                <Button text="" btnClass="btnSearch" />
              </div>
            </form>
            {searchArray.length === 0 && (
              <p
                className={s.textData__textMain}
              >{`You haven't saved any records yet.`}</p>
            )}
            <div className={s.textData__content}>
              {searchArray.length > 0 ? (
                <ul className={s.recordsList}>
                  {searchArray.map((item, index) => (
                    <li
                      key={item._id}
                      className={s.recordsListContent}
                      style={{
                        backgroundColor: index % 2 ? "#f9f9f9" : "#fff",
                      }}
                    >
                      <div className={s.recordTitle}>
                        <strong>Date:</strong> {formatDate(item.date)}
                      </div>
                      <div className={s.recordTitle}>
                        <strong>Topic:</strong> {item.topic}
                      </div>
                      <textarea
                        readOnly
                        value={item.transcription.join(" ")}
                        className={s.textArea}
                        style={{ marginBottom: "10px", marginTop: "10px" }}
                      />
                      <textarea
                        readOnly
                        value={item.translation.join(" ")}
                        className={s.textArea}
                      />
                      <div className={s.btnWrapper}>
                        <button
                          className={s.btn}
                          onClick={() => handleClick(item._id)}
                        >
                          Expand
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={s.noRecords}>
                  {`You haven't saved any records yet.`}
                </p>
              )}
              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={activePage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextDataPanel;
