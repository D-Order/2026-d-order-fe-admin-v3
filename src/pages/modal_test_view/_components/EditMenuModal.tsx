import { SetStateAction, useEffect, useRef, useState } from "react";
import preUploadImg from "@assets/images/preUploadImg.png";
import * as S from "./styled";
import { IMAGE_CONSTANTS } from "@constants/imageConstants";
import { HandleNumberInput } from "../_utils/HandleNumberInput";
import { compressImage } from "../_utils/ImageCompress";
import MenuServiceWithImg from "@services/MenuServiceWithImg";
import MenuService from "@services/MenuService";
import { BoothMenuData } from "@pages/menu/Type/Menu_type";
interface EditModalProps {
  handleCloseModal: () => void;
  onSuccess: React.Dispatch<SetStateAction<boolean>>;
  boothMenuData: BoothMenuData | undefined;
  defaultValues: {
    menu_id: number;
    menu_name: string;
    menu_description: string;
    menu_category: string;
    menu_price: number;
    menu_amount?: number;
    menu_image?: string | null; // URL
  };
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 업로드 이미지 크기 제한 10MB
const MIN_FILE_SIZE = 2.5 * 1024 * 1024;

const EditMenuModal = ({ handleCloseModal, defaultValues }: EditModalProps) => {
  const [UploadImg, setUploadImg] = useState<string | null>(null);
  const [buttonDisable, setButtonDisable] = useState<boolean>(true);

  const [category, setCategory] = useState<string>("메뉴");
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [image, setImage] = useState<File | string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imgUrl = URL.createObjectURL(file);
    setUploadImg(imgUrl);
    setImage(file); // 선택한 파일 상태에 저장
  };
  useEffect(() => {
    if (name && price && stock && category) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [name, price, stock, category]);

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.menu_name);
      setDesc(defaultValues.menu_description || "");
      setPrice(String(defaultValues.menu_price));
      setStock(String(defaultValues.menu_amount));
      setUploadImg(defaultValues.menu_image || "");
      setImage(defaultValues.menu_image || null); // 초기에는 서버 이미지 URL(string)
      setCategory(defaultValues.menu_category);
      setButtonDisable(false); // 수정 시 버튼 활성화
    }
  }, [defaultValues]);

  useEffect(() => {
    if (name && price && stock && category) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [name, price, stock, category]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value || "";
    const digitsOnly = raw.replace(/\D/g, "");
    if (!digitsOnly) {
      setPrice("");
      return;
    }
    const num = Number(digitsOnly);
    const clamped = Math.min(num, 100000);
    setPrice(String(clamped));
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value || "";
    const digitsOnly = raw.replace(/\D/g, "");
    if (!digitsOnly) {
      setStock("");
      return;
    }
    const num = Number(digitsOnly);
    const clamped = Math.min(num, 9999);
    setStock(String(clamped));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !name || !price || !stock) {
      alert("모든 필수 항목을 채워주세요.");
      return;
    }

    // V3 필드명: menu_name→name, menu_description→description,
    // menu_category→category(MENU/DRINK), menu_price→price, menu_amount→stock
    const categoryMap: Record<string, string> = {
      '메뉴': 'MENU', '메인': 'MENU', '음료': 'DRINK',
    };
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", desc || "");
    formData.append("category", categoryMap[category] ?? category);
    formData.append("price", price);
    formData.append("stock", stock);

    if (image instanceof File) {
      if (image.size > MAX_FILE_SIZE) {
        alert("이미지 용량이 10mb 를 초과하였습니다!");
        return;
      }

      // 이미지 압축 로직직
      if (image.size <= MIN_FILE_SIZE) {
        formData.append("image", image);
      } else {
        try {
          const correctedFile = await compressImage(image);
          formData.append("image", correctedFile);
        } catch (e) {
          console.log(e);
        } finally {
          handleCloseModal();
        }
      }
      try {
        await MenuServiceWithImg.updateMenu(defaultValues.menu_id, formData);
      } catch (e) {
        console.log(e);
      } finally {
        handleCloseModal();
      }
    }
    // 기존에 이미지 있던거 이미지 지울 경우
    else if (image === null && defaultValues.menu_image) {
      try {
        formData.append("image", "");
        await MenuServiceWithImg.updateMenu(defaultValues.menu_id, formData);
        setButtonDisable(false);
      } catch (err) {
        console.log(err);
      } finally {
        handleCloseModal();
      }
    }
    // 이미지 없을 경우
    else {
      try {
        await MenuService.updateMenu(defaultValues.menu_id, formData);
        handleCloseModal();
      } catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <S.Wrapper onSubmit={handleSubmit}>
      <S.ModalBody>
        <S.ModalHeader>
          메뉴 수정
          <button type="button" onClick={handleCloseModal}>
            <img src={IMAGE_CONSTANTS.CLOSE} alt="닫기" />
          </button>
        </S.ModalHeader>
        <S.FormContentWrapper>
          <S.ele>
            <S.SubTitle>
              메뉴명<span>*</span>
            </S.SubTitle>
            <S.inputText
              type="text"
              placeholder="예) 피자"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
          </S.ele>
          <S.ele>
            <S.SubTitle>메뉴 설명</S.SubTitle>
            <S.inputText
              type="text"
              placeholder="예) 이탈리아의 풍미를 잔뜩 느낄 수 있는 피자에요."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={30}
            />
          </S.ele>
          <S.ele>
            <S.SubTitle>
              메뉴 가격<span>*</span>
            </S.SubTitle>
            <S.inputText
              type="text"
              placeholder="예) 20000"
              value={price}
              onChange={handlePriceChange}
              onInput={HandleNumberInput}
            />
          </S.ele>
          <S.ele>
            <S.SubTitle>
              재고수량<span>*</span>
            </S.SubTitle>
            <S.inputText
              type="number"
              placeholder="예) 100"
              value={stock}
              onChange={handleStockChange}
              onInput={HandleNumberInput}
            />
          </S.ele>

          <S.ele>
            <S.SubTitle>메뉴 이미지</S.SubTitle>
            <S.OtherText>이미지 파일 (JPG,PNG)을 첨부해 주세요</S.OtherText>
            {/* V3 수정 시 이미지 변경 미지원 — label→div로 교체해 파일 업로드 비활성화 */}
            <div>
              <S.inputImg
                id="file-upload"
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={handleFileChange}
                multiple={false}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              {UploadImg ? (
                <S.ImgContainer>
                  <S.Img src={UploadImg} alt="첨부한 이미지" />
                  {/* V3 이미지 삭제 비활성화 — 수정 시 이미지 변경/삭제 미지원 */}
                  {/* <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={handleRemoveImage}
                  >
                    <img src={IMAGE_CONSTANTS.CLOSE2} alt="" />
                  </button> */}
                </S.ImgContainer>
              ) : (
                <img src={preUploadImg} alt="기본 이미지" />
              )}
            </div>
          </S.ele>
        </S.FormContentWrapper>
      </S.ModalBody>
      <S.ModalConfirmContainer>
        <button type="button" onClick={handleCloseModal}>
          취소
        </button>
        <button type="submit" disabled={buttonDisable}>
          메뉴 수정
        </button>
      </S.ModalConfirmContainer>
    </S.Wrapper>
  );
};

export default EditMenuModal;
