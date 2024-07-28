import { useNavigate } from 'react-router-dom';

export enum PopupType {
  Register, // src\components\authentication\Register.tsx
  RegistrationSuccess,
  RegistrationFailure,
  VerificationEmailSentSuccess,
  VerificationEmailSentFailure,

  changePassword, // src\components\myPage\EditPassword.tsx
  changePasswordSuccess,
  changePasswordFailure,

  DeleteAccount, // src\components\myPage\EditMyInformation.tsx
  DeleteAccountSuccess,
  DeleteAccountFailure,

  ChangeUserName, // src\components\myPage\EditName.tsx
  ChangeUserNameSuccess,
  ChangeUserNameFailure,

  None
}

const PopupContent = (
  type: PopupType,
  navigate: ReturnType<typeof useNavigate>
) => {
  const getPopupContent = (type: PopupType) => {
    switch (type) {
      case PopupType.RegistrationSuccess:
        return (
          <div>
            회원가입에 성공했습니다.
            {getHomeButton()}
          </div>
        );
      case PopupType.RegistrationFailure:
        return <div>회원가입에 실패했습니다.</div>;

      case PopupType.VerificationEmailSentSuccess:
        return (
          <div>
            이메일 인증 링크가 전송되었습니다. 이메일 인증 완료 후 회원가입을
            계속 진행해 주세요.
          </div>
        );
      case PopupType.VerificationEmailSentFailure:
        return <div>인증메일 전송에 실패했습니다.</div>;

      case PopupType.changePasswordSuccess:
        return <div>비밀번호를 변경했습니다.</div>;
      case PopupType.changePasswordFailure:
        return (
          <div>비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.</div>
        );

      case PopupType.DeleteAccountSuccess:
        return (
          <div>
            회원탈퇴가 정상적으로 처리되었습니다.
            {getHomeButton()}
          </div>
        );

      case PopupType.DeleteAccountFailure:
        return <div>회원탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.</div>;

      case PopupType.ChangeUserNameSuccess:
        return <div>이름을 변경했습니다. </div>;
      case PopupType.ChangeUserNameFailure:
        return <div>이름변경에 실패했습니다. 잠시 후 다시 시도해주세요.</div>;
    }
  };

  const getHomeButton = () => {
    return (
      <button
        className='bottomClose'
        onClick={() => {
          navigate('/', { replace: true });
          window.location.reload();
        }}
      >
        홈으로
      </button>
    );
  };

  return getPopupContent(type);
};

export default PopupContent;
