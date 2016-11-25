/* eslint-disable */
angular.module('myApp', [])
  .controller('mainController', ($scope) => {
    $scope.fileContent = null;
    $scope.myIndex = null;
    const myInverted = new InvertedIndex();
    $scope.showTable = false;

    /**
     * Reads uploaded file content
     */
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', () => {
      const fileLoaded = (fileInput.files[0]);
      const jsonFileType = 'application/json';
      const userFileType = fileLoaded.type;
      const isValidType = Object.is(userFileType, jsonFileType);
      if (!isValidType) {
        Materialize.toast('Invalid File Type!', 1000);
      } else {
        const readFile = new FileReader();
        readFile.onload = () => {
          const fileContent = JSON.parse(readFile.result);
          Materialize.toast('File Uploaded!', 1000);
          $scope.$apply(() => {
            $scope.fileContent = fileContent;
          });
        };
        readFile.readAsText(fileLoaded);
      }
    });

    /**
     * Checks if the content passed is Valid
     * @function checkValid
     * @param {Object} content Content of the file
     * @return {Boolean} True if valid and false if not
     */
    $scope.checkValid = (content) => {
      if (content.hasOwnProperty(undefined)) {
        return true;
      }
    };

    /**
     * Creates index of the uploaded file content and displays it in a table
     * @function createIndex
     */
    $scope.createIndex = () => {
      if (!$scope.fileContent) {
        Materialize.toast('Upload a Valid File!', 1000);
        $scope.showTable = false;
        return false;
      } else {
        myInverted.createIndex($scope.fileContent);
        $scope.myIndex = myInverted.getIndex();
        if (!(myInverted.isValidJson($scope.fileContent)) || $scope.checkValid($scope.myIndex)) {
          Materialize.toast('Please check your file!', 1000);
        } else {
          $scope.getCount();
          $scope.showTable = true;
        }
      }
    };

    /**
     * Gets the number of books/elements in the uploaded file
     * @function getCount
     */
    $scope.getCount = () => {
      const arrLength = $scope.fileContent.length;
      const count = [];
      for (let i = 0; i < arrLength; i++) {
        count.push(i);
      }
      $scope.count = count;
    };

    /**
     * Searches through the created indexes for user's input
     * @function searchIndex
     * @param {text} searchWord Texts entered to be searched.
     */
    $scope.searchIndex = (searchWord) => {
      if ($scope.myIndex === null) {
        Materialize.toast('Upload a file and create Index', 1000);
        return false;
      }
      if ((searchWord === '') || (searchWord === undefined)) {
        Materialize.toast('Enter words to search!', 1000);
      }
      $scope.myIndex = myInverted.searchIndex(searchWord);
      $scope.getCount();
      $scope.showTable = true;
    };
  });