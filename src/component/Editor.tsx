import React, { useState, useEffect, useMemo } from "react"; // useMemo도 불러오자
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Pagination,
} from "@mui/material"; // Pagination 컴포넌트 불러오기
import DeleteIcon from "@mui/icons-material/Delete";

// 로컬스토리지에 저장될 데이터의 타입 정의 (그대로)
interface Item {
  id: number;
  value: string;
}

// ✨ 페이지당 보여줄 항목 수 상수 정의 (원하는 숫자로 바꿔) ✨
const ITEMS_PER_PAGE = 5;

const MyFormComponent: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  // ✨ 현재 페이지 번호를 저장할 상태 추가 기본값은 1페이지
  const [currentPage, setCurrentPage] = useState(1);

  // ✨ 컴포넌트가 처음 마운트될 때 로컬스토리지에서 데이터 불러오기 (그대로) ✨
  useEffect(() => {
    const storedItems = localStorage.getItem("myItems");

    if (storedItems) {
      try {
        const parsedItems: Item[] = JSON.parse(storedItems);
        setItems(parsedItems);
      } catch (error) {
        console.error("Error parsing local storage data:", error);
        localStorage.removeItem("myItems");
      }
    }
  }, []);

  // 입력 필드 값 변경 핸들러 (그대로)
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  // ✨ 항목 추가 핸들러 (로컬스토리지 저장 로직 포함) ✨
  const handleAddItem = () => {
    if (text.trim()) {
      const newItem: Item = {
        id: Date.now(),
        value: text,
      };

      const updatedItems = [...items, newItem];
      setItems(updatedItems); // 상태 업데이트

      // ✨ 추가 후에는 마지막 페이지로 이동하는 경우가 많음. 전체 페이지 계산해서 이동 로직 추가 가능
      // 여기서는 일단 추가하면 현재 페이지 그대로 두고, 다음 페이지로 넘어가야 보일 수도 있게 둠.
      // 필요하다면 setItems 호출 후 setCurrentPage(Math.ceil(updatedItems.length / ITEMS_PER_PAGE)) 같은 로직 추가

      localStorage.setItem("myItems", JSON.stringify(updatedItems)); // 로컬스토리지 저장
      setText(""); // 입력 필드 초기화
    }
  };

  // ✨ 폼 제출 핸들러 (엔터 또는 버튼 클릭 시 실행) - handleAddItem 호출 (그대로) ✨
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAddItem();
  };

  // ✨ 항목 삭제 핸들러 ✨
  const handleDeleteItem = (idToDelete: number) => {
    const updatedItems = items.filter((item) => item.id !== idToDelete);
    setItems(updatedItems); // 상태 업데이트

    // ✨ 항목 삭제 후 현재 페이지의 항목 수가 0이 되고, 전체 페이지 수가 줄어들면 이전 페이지로 이동
    const newTotalPages = Math.ceil(updatedItems.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages); // 이전 페이지로 이동
    } else if (newTotalPages === 0) {
      setCurrentPage(1); // 항목이 모두 삭제되면 1페이지로
    }

    localStorage.setItem("myItems", JSON.stringify(updatedItems)); // 로컬스토리지 저장
  };

  // ✨ 전체 페이지 수를 계산 (항목 수 / 페이지당 항목 수, 올림) ✨
  // items나 ITEMS_PER_PAGE가 바뀔 때만 다시 계산되도록 useMemo 사용
  const totalPageCount = useMemo(() => {
    return Math.ceil(items.length / ITEMS_PER_PAGE);
  }, [items.length]);

  // ✨ 현재 페이지에 보여줄 항목들만 잘라내기 ✨
  // items, currentPage, ITEMS_PER_PAGE가 바뀔 때만 다시 계산되도록 useMemo 사용
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE; // 현재 페이지의 시작 인덱스
    const endIndex = startIndex + ITEMS_PER_PAGE; // 현재 페이지의 끝 인덱스
    return items.slice(startIndex, endIndex); // 시작 인덱스부터 끝 인덱스 전까지 잘라내기
  }, [items, currentPage]);

  // ✨ 페이지 변경 핸들러 ✨
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value); // 클릭한 페이지 번호로 currentPage 상태 업데이트
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {" "}
      {/* 전체 컨테이너 Box */}
      <Box
        className="flex"
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          value={text}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            input: { color: "white" },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            flexGrow: 1,
          }}
          onChange={onChangeInput}
          id="standard-basic"
          label="입력해주세요"
          variant="standard"
        />
        <Button type="submit" variant="contained" className="addButton">
          추가
        </Button>
      </Box>
      {/* ✨ 현재 페이지에 해당하는 항목들만 보여줄 리스트 ✨ */}
      {/* items.length > 0 대신 currentItems.length > 0 로 조건 변경 */}
      {currentItems.length > 0 && (
        <List
          sx={{
            mt: 2,
            // bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 1,
            padding: 1,
          }}
        >
          {/* items.map 대신 currentItems.map 사용 */}
          {currentItems.map((item) => (
            <ListItem
              sx={{
                mt: 1,
                mb: 1,
              }}
              className={"listItem"}
              key={item.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <DeleteIcon
                    sx={{ color: "white" }}
                    className="deleteButton"
                  />
                </IconButton>
              }
            >
              <ListItemText primary={item.value} sx={{ color: "white" }} />
            </ListItem>
          ))}
        </List>
      )}
      {/* ✨ MUI Pagination 컴포넌트 추가 ✨ */}
      {/* totalPageCount가 1보다 클 때만 페이지네이션 보여주기 */}
      {totalPageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          {" "}
          {/* 페이지네이션 가운데 정렬 */}
          <Pagination
            count={totalPageCount} // 전체 페이지 수
            page={currentPage} // 현재 페이지 번호
            onChange={handlePageChange} // 페이지 번호 클릭 시 호출될 함수
            color="primary" // 색상 (원하는대로 변경 가능)
            // 스타일 커스터마이징은 sx props 활용
            sx={{
              "& .MuiPaginationItem-root": {
                color: "white", // 페이지 번호 색깔
                "&.Mui-selected": {
                  bgcolor: "rgba(255, 255, 255, 0.2)", // 선택된 페이지 배경색
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default MyFormComponent;
